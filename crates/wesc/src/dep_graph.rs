use indextree::{Arena, NodeId};

use std::collections::HashMap;

use crate::component_definitions::{find_component_definitions, resolve_href};

#[derive(Debug, Clone)]
pub struct Module {
    pub name: String,
    pub file_path: String,
}

impl Module {
    pub fn new(name: String, file_path: String) -> Self {
        Self { name, file_path }
    }
}

#[derive(Debug, Clone)]
pub struct DepGraph {
    pub arena: Arena<Module>,
    pub nodes_by_path: HashMap<String, NodeId>,
}

impl Default for DepGraph {
    fn default() -> Self {
        Self::new()
    }
}

impl DepGraph {
    pub fn new() -> Self {
        Self {
            arena: Arena::new(),
            nodes_by_path: HashMap::new(),
        }
    }

    pub fn new_node(&mut self, module: Module) -> NodeId {
        let file_path_clone = module.file_path.clone();
        let node_id = self.arena.new_node(module);
        self.nodes_by_path.insert(file_path_clone, node_id);
        node_id
    }

    pub fn get_parent_file_path(&self, file_path: &str) -> Option<&str> {
        let node_id = self.nodes_by_path[file_path];
        let node = self.arena.get(node_id)?;
        let parent = node.parent()?;
        Some(&self.arena[parent].get().file_path)
    }
}

pub fn resolve_dependencies(file_path: &str) -> DepGraph {
    let mut dep_graph = DepGraph::new();
    resolve_component_dependencies("root", file_path, &mut dep_graph);
    dep_graph
}

pub fn resolve_component_dependencies(
    name: &str,
    file_path: &str,
    dep_graph: &mut DepGraph,
) -> NodeId {
    let module = Module::new(name.to_owned(), file_path.to_owned());
    let dependency = dep_graph.new_node(module);
    let host_definitions = find_component_definitions(file_path).unwrap();

    for (component_name, component_href) in host_definitions {
        let component_file_path = resolve_href(file_path, &component_href);
        let component_dependency =
            resolve_component_dependencies(&component_name, &component_file_path, dep_graph);
        dependency.append(component_dependency, &mut dep_graph.arena);
    }

    dependency
}
