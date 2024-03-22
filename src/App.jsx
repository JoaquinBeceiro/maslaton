import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import CountUp from "react-countup";
import YouTube from "react-youtube";
import Proceda from "./assets/proceda.png";

const BIRTH_DATE = new Date(1987, 11, 10);
const NOW_DATE = Date.now();
const COST_PER_FOOD_PER_SECOND = 14 / 24 / 60 / 60;
const UPDATE_INTERVAL = 2000;
const VALOR_DOLAR_BLUE = 1050;
const ANIMATION_DURATION = UPDATE_INTERVAL / 1000 / 2;

const API_DOLAR = "https://dolarapi.com/v1/dolares";

function App() {
  const [now, setNow] = useState(NOW_DATE);
  const [dolarValue, setDolarValue] = useState(null);

  const dateDiff = (firstDate, secondDate) =>
    Math.round(Math.abs(firstDate - secondDate));

  const updateNowDate = () => {
    const NEW_NOW_DATE = Date.now();
    setNow(NEW_NOW_DATE);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateNowDate();
    }, UPDATE_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getDolarValue = async () => {
    try {
      const data = await fetch(API_DOLAR).then((response) => response.json());
      const dolarBlue = data.find(({ casa }) => casa === "blue");
      setDolarValue(dolarBlue.compra);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (dolarValue === null) {
      getDolarValue();
    }
  }, [dolarValue]);

  const totalPrevCost =
    ((dateDiff(now, BIRTH_DATE) - UPDATE_INTERVAL) / 1000) *
    COST_PER_FOOD_PER_SECOND *
    100;

  const totalCost =
    (dateDiff(now, BIRTH_DATE) / 1000) * COST_PER_FOOD_PER_SECOND * 100;

  return (
    <div className="container">
      <h1>Gasto de Maslatón comiendo afuera desde los 12 años</h1>
      <YouTube videoId="jKEo0sa9t7k" id="video" />
      {dolarValue === null ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="content">
            <div className="counter-container">
              <h2>Dólares</h2>
              <CountUp
                className="counter"
                start={totalPrevCost}
                end={totalCost}
                prefix="USD "
                duration={ANIMATION_DURATION}
                formattingFn={(value) => {
                  return (
                    "USD " +
                    (value / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  );
                }}
              />
            </div>
            <div className="counter-container">
              <h2>papél falsificado</h2>
              <CountUp
                className="counter"
                start={totalPrevCost * VALOR_DOLAR_BLUE}
                end={totalCost * VALOR_DOLAR_BLUE}
                prefix="ARS "
                duration={ANIMATION_DURATION}
                formattingFn={(value) => {
                  return (
                    "ARS " +
                    (value / 100).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })
                  );
                }}
              />
            </div>
          </div>
          <p className="info">
            Valor del dolar:{" "}
            {dolarValue.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}{" "}
            obtenido desde 'https://dolarapi.com'
          </p>
          <div className="maslaton-img">
            <img src={Proceda} />
          </div>
        </>
      )}

      <p className="info">Creado por <a href="https://github.com/joaquinBeceiro" target="_blank">Joaquin</a></p>
    </div>
  );
}

export default App;
