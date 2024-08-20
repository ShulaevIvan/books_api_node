
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');


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
        const targetBook = this.bookStore.find((item) => item.id === targetId);
        this.getCounterValue(targetId)
        .then((data) => {
            const targetBook = this.bookStore.find((item) => item.id === targetId);
            targetBook.counter = data;
        })
        return targetBook;
        
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
            counter: 0,
            fileBook: data.fileBook ? data.fileBook : path.join(__dirname, '..', '/public/uploads/book_holder.png')
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
                    description: data.description ? data.description : item.description,
                    authors: data.authors ? data.authors : item.authors,
                    favorite: data.favorite ? data.favorite: item.favorite,
                    fileCover: data.fileCover ? data.fileCover: item.fileCover,
                    fileName: data.fileBook ? data.fileBook.replace('public/uploads/', '') : item.fileName,
                    fileBook: data.fileBook ? data.fileBook : `${__dirname}/public/uploads/book_holder.png` 
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
        if (!targetImage || targetImage.length < 0) return null;
        const filePath = path.join(__dirname, '..', `/public/uploads/${targetImage[0].fileBook.match(/\/([^\/]+)\/?$/)[1]}`);
        
        return filePath;
    }

    deleteBookImage(bookItem) {
        if (bookItem && bookItem.fileBook !== `public/uploads/book_holder.png`) {
            fs.unlink(`${bookItem.fileBook}`, err => {
                if(err) throw err;
            });
        }
    }
    getCounterValue(id, incr=false) {
        let counterUrl = `${process.env.COUNTER_BACKEND_URL}/counter/${id}/`;
        let methodCounter = 'GET';
        if (incr) {
            counterUrl = `${process.env.COUNTER_BACKEND_URL}/counter/${id}/incr`;
            methodCounter = 'POST';
        }
        try {
            return new Promise((resolve, reject) => {
                fetch(`${counterUrl}`, {
                    method: methodCounter,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.counter) {
                        return resolve(data.counter)
                    }
                })
            });
        }
        catch(err) {
            console.log(err);
        }
        
        
    }
    incrCounterValue(id) {
        return new Promise((resolve, reject) => {
            fetch(`${process.env.COUNTER_BACKEND_URL}/counter/${id}/incr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((data) => {
                return resolve(data.counter)
            })
        });
    }
}

const data = [];

module.exports = new Database(data);