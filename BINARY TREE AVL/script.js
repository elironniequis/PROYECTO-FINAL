// script.js

class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.izquierdo = null;
        this.derecho = null;
        this.altura = 1;
    }
}

class ArbolAVL {
    constructor() {
        this.raiz = null;
        this.logMensajes = [];
    }

    obtenerAltura(nodo) {
        if (nodo === null) {
            return 0;
        }
        return nodo.altura;
    }

    obtenerBalance(nodo) {
        if (nodo === null) {
            return 0;
        }
        return this.obtenerAltura(nodo.izquierdo) - this.obtenerAltura(nodo.derecho);
    }

    rotarDerecha(y) {
        this.registrarPaso(`Rotación derecha en nodo ${y.valor}`);
        const x = y.izquierdo;
        const T2 = x.derecho;

        x.derecho = y;
        y.izquierdo = T2;

        y.altura = Math.max(this.obtenerAltura(y.izquierdo), this.obtenerAltura(y.derecho)) + 1;
        x.altura = Math.max(this.obtenerAltura(x.izquierdo), this.obtenerAltura(x.derecho)) + 1;

        return x;
    }

    rotarIzquierda(x) {
        this.registrarPaso(`Rotación izquierda en nodo ${x.valor}`);
        const y = x.derecho;
        const T2 = y.izquierdo;

        y.izquierdo = x;
        x.derecho = T2;

        x.altura = Math.max(this.obtenerAltura(x.izquierdo), this.obtenerAltura(x.derecho)) + 1;
        y.altura = Math.max(this.obtenerAltura(y.izquierdo), this.obtenerAltura(y.derecho)) + 1;

        return y;
    }

    insertar(valor) {
        this.logMensajes = [];
        this.raiz = this.insertarNodo(this.raiz, valor);
        highlightedNode = null;
        actualizarArbol();
        this.actualizarLog();
    }

    insertarNodo(nodo, valor) {
        if (nodo === null) {
            this.registrarPaso(`Insertado ${valor} en el árbol.`);
            return new Nodo(valor);
        }

        if (valor < nodo.valor) {
            this.registrarPaso(`Insertando ${valor}: va a la izquierda de ${nodo.valor}`);
            nodo.izquierdo = this.insertarNodo(nodo.izquierdo, valor);
        } else if (valor > nodo.valor) {
            this.registrarPaso(`Insertando ${valor}: va a la derecha de ${nodo.valor}`);
            nodo.derecho = this.insertarNodo(nodo.derecho, valor);
        } else {
            return nodo; // Los valores duplicados no se permiten en el árbol AVL
        }

        nodo.altura = 1 + Math.max(this.obtenerAltura(nodo.izquierdo), this.obtenerAltura(nodo.derecho));

        const balance = this.obtenerBalance(nodo);
        this.registrarPaso(`Balance de nodo ${nodo.valor} es ${balance}`);

        if (balance > 1 && valor < nodo.izquierdo.valor) {
            return this.rotarDerecha(nodo);
        }

        if (balance < -1 && valor > nodo.derecho.valor) {
            return this.rotarIzquierda(nodo);
        }

        if (balance > 1 && valor > nodo.izquierdo.valor) {
            nodo.izquierdo = this.rotarIzquierda(nodo.izquierdo);
            return this.rotarDerecha(nodo);
        }

        if (balance < -1 && valor < nodo.derecho.valor) {
            nodo.derecho = this.rotarDerecha(nodo.derecho);
            return this.rotarIzquierda(nodo);
        }

        return nodo;
    }

    eliminar(valor) {
        this.logMensajes = [];
        this.raiz = this.eliminarNodo(this.raiz, valor);
        highlightedNode = null;
        actualizarArbol();
        this.actualizarLog();
    }

    eliminarNodo(nodo, valor) {
        if (nodo === null) {
            return nodo;
        }

        if (valor < nodo.valor) {
            this.registrarPaso(`Buscando ${valor} para eliminar: va a la izquierda de ${nodo.valor}`);
            nodo.izquierdo = this.eliminarNodo(nodo.izquierdo, valor);
        } else if (valor > nodo.valor) {
            this.registrarPaso(`Buscando ${valor} para eliminar: va a la derecha de ${nodo.valor}`);
            nodo.derecho = this.eliminarNodo(nodo.derecho, valor);
        } else {
            if (nodo.izquierdo === null || nodo.derecho === null) {
                const temp = nodo.izquierdo ? nodo.izquierdo : nodo.derecho;

                if (temp === null) {
                    this.registrarPaso(`Eliminando nodo hoja ${nodo.valor}`);
                    nodo = null;
                } else {
                    this.registrarPaso(`Eliminando nodo ${nodo.valor} con un solo hijo`);
                    nodo = temp;
                }
            } else {
                const temp = this.obtenerMinimo(nodo.derecho);
                this.registrarPaso(`Reemplazando valor de nodo ${nodo.valor} con ${temp.valor}`);
                nodo.valor = temp.valor;
                nodo.derecho = this.eliminarNodo(nodo.derecho, temp.valor);
            }
        }

        if (nodo === null) {
            return nodo;
        }

        nodo.altura = 1 + Math.max(this.obtenerAltura(nodo.izquierdo), this.obtenerAltura(nodo.derecho));

        const balance = this.obtenerBalance(nodo);
        this.registrarPaso(`Balance de nodo ${nodo.valor} es ${balance}`);

        if (balance > 1 && this.obtenerBalance(nodo.izquierdo) >= 0) {
            return this.rotarDerecha(nodo);
        }

        if (balance > 1 && this.obtenerBalance(nodo.izquierdo) < 0) {
            nodo.izquierdo = this.rotarIzquierda(nodo.izquierdo);
            return this.rotarDerecha(nodo);
        }

        if (balance < -1 && this.obtenerBalance(nodo.derecho) <= 0) {
            return this.rotarIzquierda(nodo);
        }

        if (balance < -1 && this.obtenerBalance(nodo.derecho) > 0) {
            nodo.derecho = this.rotarDerecha(nodo.derecho);
            return this.rotarIzquierda(nodo);
        }

        return nodo;
    }

    obtenerMinimo(nodo) {
        let actual = nodo;
        while (actual.izquierdo !== null) {
            actual = actual.izquierdo;
        }
        return actual;
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

const arbol = new ArbolAVL();
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
                }, 1000);
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
                }, 1000);
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
        setTimeout(animarPaso, 1000);
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
