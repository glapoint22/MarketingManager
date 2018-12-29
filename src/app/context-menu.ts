export class ContextMenu {
    public menuGroups: Array<MenuGroup> = [];

    createMenuGroup(): MenuGroup {
        this.menuGroups.push(new MenuGroup());
        return this.menuGroups[this.menuGroups.length - 1];
    }
}

export class MenuGroup {
    menuRows: Array<MenuRow> = [];

    createMenuRow(caption: string, action?: Function, isDisabled?: Function): MenuRow {
        this.menuRows.push(new MenuRow(caption, action, isDisabled));
        return this.menuRows[this.menuRows.length - 1];
    }
}

export class MenuRow {
    public subMenu: ContextMenu;
    constructor(public caption: string, public action: Function, public isDisabled: Function) { }
}