import { useAuth } from "../context/AuthContext";
import { calculateCurrentCaffeineLevel, coldDrinkConsumptionHistory, getCaffeineAmount, timeSinceConsumption } from "../utils";

export default function History() {
  const { globalData } = useAuth();

  return (
    <>
      <div className="section-header">
        <i className="fa-solid fa-timeline" />
        <h2>History</h2>
      </div>
      <p><i>Hover for more information!</i></p>
      <div className="drink-history">
        {Object.keys(globalData).sort((a, b) => b - a).map((utcTime, drinkIndex) => {
          const drink = globalData[utcTime];
          const timeSinceConsume = timeSinceConsumption(utcTime);
          const originalAmount = getCaffeineAmount(drink.name);
          const remainingAmount = calculateCurrentCaffeineLevel({
            [utcTime]: drink.name
          });

          const summary = `${drink.name} | ${timeSinceConsume} | $${drink.cost} | ${remainingAmount}mg / ${originalAmount}mg`;

          return (
            <div title={summary} key={drinkIndex}>
              <i className="fa-solid fa-bottle-water" />
              </div>
          );
        })}
      </div>
    </>
  );
}



