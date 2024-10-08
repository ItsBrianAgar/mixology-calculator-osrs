import React, { useEffect } from "react";
import "./BankedHerbsSummary.css";
import SelectedHerbsList from "../SelectedHerbsList/SelectedHerbsList";
import SelectedHerbTotals from "../SelectedHerbTotals/SelectedHerbTotals";
import { useProductContext } from "../../context/ProductContext";

export default function BankedHerbsSummary({
  selectedHerbs,
  herbsData,
  updateHerbTotals,
}) {
  const { preferredProducts, blacklistedProducts } = useProductContext();

  const calculateTotals = () => {
    let totalHerbs = 0;
    let totalMox = 0;
    let totalAga = 0;
    let totalLye = 0;
    let totalHerbloreXP = 0;

    Object.entries(selectedHerbs).forEach(([herbKey, quantity]) => {
      const herb = herbsData.find((h) => h.key === herbKey);
      if (herb) {
        totalHerbs += quantity;
        totalHerbloreXP += herb.herbloreXP * quantity;

        switch (herb.pasteType) {
          case "Mox":
            totalMox += herb.pasteYield * quantity;
            break;
          case "Aga":
            totalAga += herb.pasteYield * quantity;
            break;
          case "Lye":
            totalLye += herb.pasteYield * quantity;
            break;
          default:
            break;
        }
      }
    });

    return { totalHerbs, totalMox, totalAga, totalLye, totalHerbloreXP };
  };

  const totals = calculateTotals();

  useEffect(() => {
    updateHerbTotals(totals);
  }, [selectedHerbs, updateHerbTotals]);

  return (
    <div className="banked-herbs-summary">
      <h3>Banked Herbs Summary:</h3>
      {Object.keys(selectedHerbs).length === 0 ? (
        <p className="grey-text">No herbs selected yet.</p>
      ) : (
        <>
          <SelectedHerbsList
            selectedHerbs={selectedHerbs}
            herbsData={herbsData}
            preferredProducts={preferredProducts}
            blacklistedProducts={blacklistedProducts}
          />
          <SelectedHerbTotals totals={totals} />
        </>
      )}
    </div>
  );
}
