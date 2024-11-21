
class Category {
    id: number;
    userId: number;
    title: string;
    created: string;
    updated: string;
    deleted: boolean;

    constructor(id: number, userId: number, title: string, created: string, updated: string, deleted: boolean) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.created = created;
        this.updated = updated;
        this.deleted = deleted;
    }
}

export default Category;