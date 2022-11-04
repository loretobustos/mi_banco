
CREATE DATABASE banco;

\c banco

CREATE TABLE cuenta (
    id INT PRIMARY KEY,
    saldo DECIMAL CHECK (saldo >= 0 ) 
);

CREATE TABLE transaccion(
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(50),
    cuenta INT,
    monto DECIMAL,
    fecha VARCHAR(10),
    FOREIGN KEY (cuenta) REFERENCES cuenta (id)
);