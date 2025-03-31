import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { db } from "./firebaseConfig"; // Importa Firebase
import { collection, addDoc } from "firebase/firestore";

const App = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [puntaje, setPuntaje] = useState(0);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(30);

  useEffect(() => {
    let timer;
    if (juegoIniciado && tiempoRestante > 0) {
      timer = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      guardarEnFirestore();
      setJuegoIniciado(false);
    }
    return () => clearInterval(timer);
  }, [juegoIniciado, tiempoRestante]);

  const iniciarJuego = () => {
    if (!nombre || !edad) {
      Alert.alert("Error", "Por favor, ingresa tu nombre y edad.");
      return;
    }
    setPuntaje(0);
    setTiempoRestante(30);
    setJuegoIniciado(true);
  };

  const aumentarPuntaje = () => {
    if (juegoIniciado) {
      setPuntaje((prev) => prev + 1);
    }
  };

  const guardarEnFirestore = async () => {
    try {
      await addDoc(collection(db, "puntajes"), {
        nombre,
        edad,
        puntaje,
        fecha: new Date(),
      });
      Alert.alert(`¡Tiempo terminado! Puntaje guardado: ${puntaje}`);
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo guardar el puntaje.");
    }
  };

  return (
    <View style={styles.container}>
      {!juegoIniciado ? (
        <View style={styles.inicio}>
          <Text style={styles.title}>Ingrese sus datos</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
          />
          <Button title="Iniciar Juego" onPress={iniciarJuego} />
        </View>
      ) : (
        <View style={styles.juego}>
          <Text style={styles.timer}>Tiempo: {tiempoRestante}s</Text>
          <Text style={styles.score}>Puntaje: {puntaje}</Text>
          <View style={styles.circle} onStartShouldSetResponder={aumentarPuntaje} />
          <Button title="Reiniciar Puntaje" onPress={() => setPuntaje(0)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  inicio: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    width: "80%",
    paddingHorizontal: 10,
  },
  juego: {
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    fontSize: 18,
    marginBottom: 10,
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
  },
  circle: {
    width: 100,
    height: 100,
    backgroundColor: "blue",
    borderRadius: 50,
    marginBottom: 20,
    position: "absolute",
    top: Math.random() * 200 + 100, // Posición aleatoria en Y
    left: Math.random() * 200 + 100, // Posición aleatoria en X
  },
});

export default App;
