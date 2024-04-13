use indextree::{Arena, NodeId};

use std::{collections::HashMap, path::Path};

use crate::component_definitions::find_component_definitions;

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

pub fn resolve_dependencies(file_path: &str, dep_graph: &mut DepGraph) {
    resolve_component_dependencies("root", file_path, dep_graph);
}

pub fn resolve_component_dependencies(name: &str, file_path: &str, dep_graph: &mut DepGraph) {
    let module = Module::new(name.to_owned(), file_path.to_owned());
    let dependency = dep_graph.new_node(module);
    let host_definitions = find_component_definitions(&file_path).unwrap();
    let dir = Path::new(&file_path).parent().unwrap();

    for (component_name, component_href) in host_definitions {
        let component_href = Path::new(&component_href);
        let component_file_path = dir.join(&component_href);
        let component_file_path_string = component_file_path.to_string_lossy().to_string();

        resolve_component_dependencies(&component_name, &component_file_path_string, dep_graph);

        let module = Module::new(component_name, component_file_path_string.clone());
        let component_dependency = dep_graph.new_node(module);
        dependency.append(component_dependency, &mut dep_graph.arena);
    }
}
