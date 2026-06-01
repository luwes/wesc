//#region .wesc/scripts/tests/fixtures/todo-app/todo-header.js
var TodoHeader = class extends HTMLElement {};
customElements.define("todo-header", TodoHeader);
//#endregion
//#region .wesc/scripts/tests/fixtures/todo-app/todo-form.js
var TodoForm = class extends HTMLElement {
	connectedCallback() {
		this.querySelector("form")?.addEventListener("submit", (event) => {
			event.preventDefault();
			const input = event.currentTarget.elements.title;
			const title = input.value.trim();
			if (!title) return;
			this.dispatchEvent(new CustomEvent("todo-add", {
				bubbles: true,
				composed: true,
				detail: { title }
			}));
			input.value = "";
		});
	}
};
customElements.define("todo-form", TodoForm);
//#endregion
//#region .wesc/scripts/tests/fixtures/todo-app/todo-list.js
var TodoList = class extends HTMLElement {
	get items() {
		return [...this.querySelectorAll("todo-item")];
	}
	addItem(title) {
		const item = document.getElementById("todo-item-template").content.firstElementChild.cloneNode(true);
		const label = item.querySelector("label");
		if (label) label.textContent = title;
		const edit = item.querySelector(".edit");
		if (edit) edit.value = title;
		this.querySelector(".todo-list")?.append(item);
	}
};
customElements.define("todo-list", TodoList);
//#endregion
//#region .wesc/scripts/tests/fixtures/todo-app/todo-item.js
var TodoItem = class extends HTMLElement {
	connectedCallback() {
		if (this.getAttribute("status") === "completed") this.completed = true;
		this.querySelector(".toggle")?.addEventListener("change", (event) => {
			this.completed = event.target.checked;
			this.dispatchEvent(new CustomEvent("todo-toggle", { bubbles: true }));
		});
		this.querySelector(".destroy")?.addEventListener("click", () => {
			this.dispatchEvent(new CustomEvent("todo-remove", { bubbles: true }));
		});
		this.querySelector("label")?.addEventListener("dblclick", () => {
			this.startEditing();
		});
		this.querySelector(".edit")?.addEventListener("keydown", (event) => {
			if (event.key === "Enter") this.commitEdit();
			if (event.key === "Escape") this.cancelEdit();
		});
		this.querySelector(".edit")?.addEventListener("blur", () => {
			if (this.hasAttribute("editing")) this.commitEdit();
		});
	}
	get completed() {
		return this.getAttribute("status") === "completed";
	}
	set completed(value) {
		this.toggleAttribute("data-completed", value);
		this.querySelector(".toggle").checked = value;
		if (value) this.setAttribute("status", "completed");
		else this.removeAttribute("status");
	}
	startEditing() {
		const edit = this.querySelector(".edit");
		edit.value = this.querySelector("label").textContent;
		this.dataset.previousTitle = edit.value;
		this.setAttribute("editing", "");
		edit.focus();
		edit.setSelectionRange(edit.value.length, edit.value.length);
	}
	commitEdit() {
		const title = this.querySelector(".edit").value.trim();
		if (!title) {
			this.dispatchEvent(new CustomEvent("todo-remove", { bubbles: true }));
			return;
		}
		this.querySelector("label").textContent = title;
		this.removeAttribute("editing");
		delete this.dataset.previousTitle;
	}
	cancelEdit() {
		const edit = this.querySelector(".edit");
		edit.value = this.dataset.previousTitle ?? this.querySelector("label").textContent;
		this.removeAttribute("editing");
		delete this.dataset.previousTitle;
	}
};
customElements.define("todo-item", TodoItem);
//#endregion
//#region .wesc/scripts/tests/fixtures/todo-app/todo-footer.js
var TodoFooter = class extends HTMLElement {
	static get observedAttributes() {
		return ["count"];
	}
	connectedCallback() {
		this.updateCount();
		this.querySelector(".clear-completed")?.addEventListener("click", () => {
			this.dispatchEvent(new CustomEvent("todo-clear-completed", { bubbles: true }));
		});
	}
	attributeChangedCallback() {
		this.updateCount();
	}
	updateCount() {
		const count = Number(this.getAttribute("count") ?? 0);
		const label = count === 1 ? "item" : "items";
		const countElement = this.querySelector(".todo-count");
		if (countElement) countElement.innerHTML = `<strong>${count}</strong> ${label} left`;
	}
	selectFilter(filter) {
		this.querySelectorAll(".filters a").forEach((link) => {
			const linkFilter = link.getAttribute("href").replace("#/", "") || "all";
			link.classList.toggle("selected", linkFilter === filter);
		});
	}
};
customElements.define("todo-footer", TodoFooter);
//#endregion
//#region .wesc/scripts/tests/fixtures/todo-app/todo-app.js
var TodoApp = class extends HTMLElement {
	connectedCallback() {
		this.dataset.enhanced = "true";
		this.addEventListener("todo-add", (event) => {
			this.querySelector("todo-list")?.addItem(event.detail.title);
			this.updateCount();
		});
		this.addEventListener("todo-remove", (event) => {
			event.target.closest("todo-item")?.remove();
			this.updateCount();
		});
		this.addEventListener("todo-toggle", () => {
			this.updateCount();
		});
		this.querySelector(".toggle-all")?.addEventListener("change", (event) => {
			this.querySelectorAll("todo-item").forEach((item) => {
				item.completed = event.target.checked;
			});
			this.updateCount();
		});
		this.querySelector("todo-footer")?.addEventListener("todo-clear-completed", () => {
			this.querySelectorAll("todo-item[status=\"completed\"]").forEach((item) => {
				item.remove();
			});
			this.updateCount();
		});
		window.addEventListener("hashchange", () => this.applyFilter());
		this.updateCount();
		this.applyFilter();
	}
	updateCount() {
		const items = [...this.querySelectorAll("todo-item")];
		const remaining = items.filter((item) => item.getAttribute("status") !== "completed").length;
		this.querySelector("todo-footer")?.setAttribute("count", String(remaining));
		this.querySelector(".toggle-all").checked = items.length > 0 && remaining === 0;
		this.applyFilter();
	}
	applyFilter() {
		const filter = location.hash.replace("#/", "") || "all";
		this.querySelectorAll("todo-item").forEach((item) => {
			const completed = item.getAttribute("status") === "completed";
			item.hidden = filter === "active" && completed || filter === "completed" && !completed;
		});
		this.querySelector("todo-footer")?.selectFilter(filter);
	}
};
customElements.define("todo-app", TodoApp);
//#endregion
