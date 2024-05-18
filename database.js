
const { v4: uuid } = require('uuid');

class Database {
    constructor(store) {
        this.bookStore = store;
        this.staticUser = {
            id: 1,
            login: 'test@mail.ru'
        };
    }

    authUser() {
        return this.staticUser;
    }
    
    getBooks(many=true, targetId) {
        if (many || !targetId) {
            return this.bookStore;
        }
        return this.bookStore.find((item) => item.id === targetId);
    }

    createBook(data) {
        const book = {
            id: uuid(),
            title: data.title,
            description: data.description,
            authors: data.authors,
            favorite: data.favorite,
            fileCover: data.fileCover,
            fileName: data.fileName,

        };
        this.bookStore.push(book);

        return book;
    }

    editBook(targetId, data) {
        this.bookStore = this.bookStore.map((item) => {
            if (item.id === targetId) {
                return {
                    id: item.id,
                    title: data.title ? data.title : item.title,
                    description: data.description ? data.title : item.title,
                    authors: data.authors ? data.authors : item.authors,
                    favorite: data.favorite ? data.favorite: item.favorite,
                    fileCover: data.fileCover ? data.fileCover: item.fileCover,
                    fileName: data.fileName ? data.fileName : item.fileName,  
                }
            }
            return item;
        });
        return this.bookStore.find((item) => item.id === targetId);
    }

    deleteBook(id) {
        if (!id) return;
        this.bookStore = [...this.bookStore.filter((item) => item.id !== id)]
        return 'ok';
    }
}

const data = [];




module.exports = new Database(data);