class BookmarkItem {
    id: number;
    userId: number;
    imageUrl: string;
    categoryId: number;
    title: string;
    link: string;
    created: string;
    updated: string;
    deleted: boolean;

    constructor(
      id: number,
      categoryId: number,
      userId: number,
      imageUrl: string,
      title: string,
      link: string,
      created: string,
      updated: string,
      deleted: boolean
    ) {
      this.id = id;
      this.categoryId = categoryId;
      this.userId = userId;
      this.imageUrl = imageUrl;
      this.title = title;
      this.link = link;
      this.created = created;
      this.updated = updated;
      this.deleted = deleted;
    }
  
  }
  export default BookmarkItem;