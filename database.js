
const { v4: uuid } = require('uuid');
const fs = require('fs');
const os = require('os');
const PORT = process.env.PORT || 3000;
const HOST = os.networkInterfaces().lo[0].address;

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
            fileBook: data.fileBook ? data.fileBook : `${__dirname}/src/images/book_holder.png`
        };
        this.bookStore.push(book);

        return book;
    }

    editBook(targetId, data) {
        this.bookStore = this.bookStore.map((item) => {
            if (item.id === targetId) {
                this.deleteBookImage(item);
                return {
                    id: item.id,
                    title: data.title ? data.title : item.title,
                    description: data.description ? data.title : item.title,
                    authors: data.authors ? data.authors : item.authors,
                    favorite: data.favorite ? data.favorite: item.favorite,
                    fileCover: data.fileCover ? data.fileCover: item.fileCover,
                    fileName: data.fileName ? data.fileName : item.fileName,
                    fileBook: data.fileBook ? data.fileBook : `${__dirname}/src/images/book_holder.png` 
                }
            }
            return item;
        });
        return this.bookStore.find((item) => item.id === targetId);
    }

    deleteBook(id) {
        if (!id) return;
        const bookImage = this.bookStore.find((item) => item.id === id);
        this.bookStore = [...this.bookStore.filter((item) => item.id !== id)];
        
        this.deleteBookImage(bookImage);
        
        return 'ok';
    }

    downloadBookImage(id) {
        const targetImage = this.bookStore.filter((item) => item.id === id);
        if (!targetImage) return null;
        if (targetImage.length > 0) return `http://${HOST}:${PORT}/${targetImage[0].fileBook.replace(/src\//, '')}`
    }

    deleteBookImage(bookItem) {
        if (bookItem && bookItem.fileBook !== `src/images/book_holder.png`) {
            fs.unlink(`${__dirname}/${bookItem.fileBook}`, err => {
                if(err) throw err;
            });
        }
    }
    
}

const data = [];

module.exports = new Database(data);