const {app, BrowserWindow, Menu, ipcMain } = require ('electron');

const url = require('url');
const path = require('path');


if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}


let mainWindow
let newProductWindow

app.on('ready',() => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'view/index.html'),
        protocol: 'file',
        slashes: true
    }))

    const mainmenu = Menu.buildFromTemplate(templatemenu);
    Menu.setApplicationMenu(mainmenu);

    mainWindow.on('closed', () => {
        app.quit();
    })
} );


function createNewProductWindow() {
    newProductWindow = new BrowserWindow({
        width: 400,
        height: 330,
        title: 'Add a New Product'
    });
    newProductWindow.setMenu(null);
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'view/new-product.html'),
        protocol: 'file',
        slashes: true
    }))

    newProductWindow.on('closed', () => {
        newProductWindow = null;
    });
}

ipcMain.on('new-product', (e, newProduct) => {
    mainWindow.webContents.send('new-product', newProduct);
    newProductWindow.close();
} );


const templatemenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Product',
                accelerator: process.platform == 'darwin' ? 'command+N' :'CTRL+N',
                click(){
                   createNewProductWindow();
                }
            },
            {
                label: 'Remove All Products',
                click() {
                    mainWindow.webContents.send('products-removeall');
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'CTRL+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    
];

if(process.platform === 'darwin') {
    templatemenu.unshift({
        label: app.getName()
    });
}

if(process.env.NODE_ENV !== 'production') {
    templatemenu.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'show/hide Dev Tools',
                accelerator: process.platform == 'darwin' ? 'command+D' : 'CTRL+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}