// script.js

class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.izquierdo = null;
        this.derecho = null;
    }
    
}


class ArbolBinario {
    constructor() {
        this.raiz = null;
        this.logMensajes = [];
    }
    

    insertar(valor) {
        this.logMensajes = [];
        const nuevoNodo = new Nodo(valor);
        if (this.raiz === null) {
            this.raiz = nuevoNodo;
            this.registrarPaso(`Insertado ${valor} como la raíz del árbol.`);
        } else {
            this.insertarNodo(this.raiz, nuevoNodo);
        }
        highlightedNode = null;
        actualizarArbol();
        this.actualizarLog();
    }

    insertarNodo(nodo, nuevoNodo) {
        this.registrarPaso(`Comparando ${nuevoNodo.valor} con ${nodo.valor}`);
        if (nuevoNodo.valor < nodo.valor) {
            this.registrarPaso(`${nuevoNodo.valor} es menor que ${nodo.valor}, va a la izquierda.`);
            if (nodo.izquierdo === null) {
                nodo.izquierdo = nuevoNodo;
                this.registrarPaso(`Insertado ${nuevoNodo.valor} a la izquierda de ${nodo.valor}.`);
            } else {
                this.insertarNodo(nodo.izquierdo, nuevoNodo);
            }
        } else if (nuevoNodo.valor > nodo.valor) {
            this.registrarPaso(`${nuevoNodo.valor} es mayor que ${nodo.valor}, va a la derecha.`);
            if (nodo.derecho === null) {
                nodo.derecho = nuevoNodo;
                this.registrarPaso(`Insertado ${nuevoNodo.valor} a la derecha de ${nodo.valor}.`);
            } else {
                this.insertarNodo(nodo.derecho, nuevoNodo);
            }
        }
    }

    eliminar(valor) {
        this.logMensajes = [];
        this.raiz = this.eliminarNodo(this.raiz, valor);
        this.registrarPaso(`Eliminado ${valor} del árbol.`);
        this.actualizarLog();
    }

    eliminarNodo(nodo, valor) {
        if (nodo === null) {
            return null;
        }
        if (valor < nodo.valor) {
            nodo.izquierdo = this.eliminarNodo(nodo.izquierdo, valor);
            this.registrarPaso(`Buscando ${valor} para eliminar: va a la izquierda de ${nodo.valor}.`);
            return nodo;
        } else if (valor > nodo.valor) {
            nodo.derecho = this.eliminarNodo(nodo.derecho, valor);
            this.registrarPaso(`Buscando ${valor} para eliminar: va a la derecha de ${nodo.valor}.`);
            return nodo;
        } else {
            if (nodo.izquierdo === null && nodo.derecho === null) {
                return null;
            }
            if (nodo.izquierdo === null) {
                return nodo.derecho;
            }
            if (nodo.derecho === null) {
                return nodo.izquierdo;
            }
            let tempNodo = this.encontrarMinimo(nodo.derecho);
            this.registrarPaso(`Reemplazando ${nodo.valor} con ${tempNodo.valor}.`);
            nodo.valor = tempNodo.valor;
            nodo.derecho = this.eliminarNodo(nodo.derecho, tempNodo.valor);
            return nodo;
        }
    }

    encontrarMinimo(nodo) {
        while (nodo.izquierdo !== null) {
            nodo = nodo.izquierdo;
        }
        return nodo;
    }

    buscar(valor) {
        this.logMensajes = [];
        const resultado = this.buscarNodo(this.raiz, valor);
        if (resultado) {
            this.registrarPaso(`Encontrado ${valor} en el árbol.`);
        } else {
            this.registrarPaso(`No se encontró ${valor} en el árbol.`);
        }
        this.actualizarLog();
        return resultado;
    }

    buscarNodo(nodo, valor) {
        if (nodo === null) {
            return null;
        }
        if (valor < nodo.valor) {
            this.registrarPaso(`Buscando ${valor}: va a la izquierda de ${nodo.valor}.`);
            return this.buscarNodo(nodo.izquierdo, valor);
        } else if (valor > nodo.valor) {
            this.registrarPaso(`Buscando ${valor}: va a la derecha de ${nodo.valor}.`);
            return this.buscarNodo(nodo.derecho, valor);
        } else {
            return nodo;
        }
    }

    registrarPaso(paso) {
        this.logMensajes.push(paso);
    }

    actualizarLog() {
        const logContainer = document.getElementById('log-container');
        logContainer.innerHTML = '';
        this.logMensajes.forEach(mensaje => {
            const mensajeElemento = document.createElement('div');
            mensajeElemento.textContent = mensaje;
            logContainer.appendChild(mensajeElemento);
        });
    }
}

const arbol = new ArbolBinario();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let highlightedNode = null;
let highlightedColor = null;

function dibujarNodo(x, y, valor, color = 'white') {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#3498db';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(valor, x, y);
}

function dibujarLinea(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#3498db';
    ctx.stroke();
}

function dibujarArbol(nodo, x, y, espaciado) {
    if (nodo !== null) {
        let color = 'white';
        if (highlightedNode === nodo) {
            color = highlightedColor;
        }
        dibujarNodo(x, y, nodo.valor, color);
        if (nodo.izquierdo !== null) {
            dibujarLinea(x, y + 20, x - espaciado, y + 60);
            dibujarArbol(nodo.izquierdo, x - espaciado, y + 60, espaciado / 2);
        }
        if (nodo.derecho !== null) {
            dibujarLinea(x, y + 20, x + espaciado, y + 60);
            dibujarArbol(nodo.derecho, x + espaciado, y + 60, espaciado / 2);
        }
    }
}

function limpiarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function actualizarArbol() {
    limpiarCanvas();
    dibujarArbol(arbol.raiz, canvas.width / 2, 40, canvas.width / 4);
}

function animarInsercion(valor) {
    let nodoActual = arbol.raiz;
    let x = canvas.width / 2;
    let y = 40;
    let espaciado = canvas.width / 4;

    function animarPaso() {
        limpiarCanvas();
        dibujarArbol(arbol.raiz, canvas.width / 2, 40, canvas.width / 4);
        dibujarNodo(x, y, valor, '#f1c40f');

        if (nodoActual === null) {
            highlightedNode = arbol.buscar(valor);
            highlightedColor = '#f1c40f';
            actualizarArbol();
            arbol.registrarPaso(`El valor ${valor} ha sido insertado como la raíz del árbol.`);
            arbol.actualizarLog();
            return;
        }

        if (valor < nodoActual.valor) {
            if (nodoActual.izquierdo === null) {
                setTimeout(() => {
                    highlightedNode = arbol.buscar(valor);
                    highlightedColor = '#f1c40f';
                    actualizarArbol();
                    arbol.registrarPaso(`El valor ${valor} ha sido insertado en el lado izquierdo del nodo con valor ${nodoActual.valor}.`);
                    arbol.actualizarLog();
                }, 500);
                return;
            }
            x -= espaciado;
            nodoActual = nodoActual.izquierdo;
        } else if (valor > nodoActual.valor) {
            if (nodoActual.derecho === null) {
                setTimeout(() => {
                    highlightedNode = arbol.buscar(valor);
                    highlightedColor = '#f1c40f';
                    actualizarArbol();
                    arbol.registrarPaso(`El valor ${valor} ha sido insertado en el lado derecho del nodo con valor ${nodoActual.valor}.`);
                    arbol.actualizarLog();
                }, 500);
                return;
            }
            x += espaciado;
            nodoActual = nodoActual.derecho;
        } else {
            arbol.actualizarLog();
            return;
        }
        y += 60;
        espaciado /= 2;
        setTimeout(animarPaso, 500);
    }

    animarPaso();
}

function insertar() {
    const input = document.getElementById('valorInsertar');
    const valor = parseInt(input.value);
    if (!isNaN(valor)) {
        arbol.insertar(valor);
        input.value = '';
        animarInsercion(valor);
    }
}

function animarBusqueda(valor) {
    let nodoActual = arbol.raiz;
    let x = canvas.width / 2;
    let y = 40;
    let espaciado = canvas.width / 4;

    function animarPaso() {
        limpiarCanvas();
        dibujarArbol(arbol.raiz, canvas.width / 2, 40, canvas.width / 4);
        dibujarNodo(x, y, nodoActual.valor, '#3498db');

        if (valor === nodoActual.valor) {
            setTimeout(() => {
                highlightedNode = arbol.buscar(valor);
                highlightedColor = '#3498db';
                actualizarArbol();
                arbol.registrarPaso(`El valor ${valor} ha sido encontrado en el nodo.`);
                arbol.actualizarLog();
            }, 500);
            return;
        }

        if (valor < nodoActual.valor) {
            if (nodoActual.izquierdo === null) {
                arbol.registrarPaso(`El valor ${valor} no se encuentra en el árbol.`);
                arbol.actualizarLog();
                return;
            }
            x -= espaciado;
            nodoActual = nodoActual.izquierdo;
        } else {
            if (nodoActual.derecho === null) {
                arbol.registrarPaso(`El valor ${valor} no se encuentra en el árbol.`);
                arbol.actualizarLog();
                return;
            }
            x += espaciado;
            nodoActual = nodoActual.derecho;
        }
        y += 60;
        espaciado /= 2;
        setTimeout(animarPaso, 500);
    }

    if (nodoActual === null) {
        arbol.registrarPaso(`El valor ${valor} no se encuentra en el árbol.`);
        arbol.actualizarLog();
    } else {
        animarPaso();
    }
}

function buscar() {
    const input = document.getElementById('valorBuscar');
    const valor = parseInt(input.value);
    if (!isNaN(valor)) {
        input.value = '';
        animarBusqueda(valor);
    }
}

function animarEliminacion(valor) {
    let nodoActual = arbol.raiz;
    let x = canvas.width / 2;
    let y = 40;
    let espaciado = canvas.width / 4;

    function animarPaso() {
        limpiarCanvas();
        dibujarArbol(arbol.raiz, canvas.width / 2, 40, canvas.width / 4);
        dibujarNodo(x, y, nodoActual.valor, '#e74c3c');

        if (valor === nodoActual.valor) {
            setTimeout(() => {
                arbol.eliminar(valor);
                highlightedNode = null;
                actualizarArbol();
                arbol.registrarPaso(`El valor ${valor} ha sido eliminado del árbol.`);
                arbol.actualizarLog();
            }, 1000);
            return;
        }

        if (valor < nodoActual.valor) {
            if (nodoActual.izquierdo === null) {
                arbol.registrarPaso(`El valor ${valor} no se encuentra en el árbol.`);
                arbol.actualizarLog();
                return;
            }
            x -= espaciado;
            nodoActual = nodoActual.izquierdo;
        } else {
            if (nodoActual.derecho === null) {
                arbol.registrarPaso(`El valor ${valor} no se encuentra en el árbol.`);
                arbol.actualizarLog();
                return;
            }
            x += espaciado;
            nodoActual = nodoActual.derecho;
        }
        y += 60;
        espaciado /= 2;
        setTimeout(animarPaso, 1000);
    }

    if (nodoActual === null) {
        arbol.registrarPaso(`El valor ${valor} no se encuentra en el árbol.`);
        arbol.actualizarLog();
    } else {
        animarPaso();
    }
}

function eliminar() {
    const input = document.getElementById('valorEliminar');
    const valor = parseInt(input.value);
    if (!isNaN(valor)) {
        input.value = '';
        animarEliminacion(valor);
    }
}

function limpiarArbol() {
    arbol.raiz = null;
    highlightedNode = null;
    actualizarArbol();
    limpiarLog();
    arbol.registrarPaso('Árbol limpiado');
    arbol.actualizarLog();
}

function limpiarLog() {
    const logContainer = document.getElementById('log-container');
    logContainer.innerHTML = '';
}


actualizarArbol();
