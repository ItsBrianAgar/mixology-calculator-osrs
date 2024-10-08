import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
// Components
import RewardSelection from "./components/RewardSelection/RewardSelection.jsx";
import HerbloreConfiguration from "./components/HerbloreConfiguration/HerbloreConfiguration.jsx";
import ResourceCalculation from "./components/ResourceCalculation/ResourceCalculation.jsx";
// Utils
import useDocumentMeta from "./hooks/useDocumentMeta.js";
import { rewards } from "./data/helper-data.js";
import { ProductProvider } from "./context/ProductContext.js";
import { extractColors } from "./utils/colorUtils.js";
// Images
import favicon from "./images//favicons/huasca.png";
import spriteSheetImage from "../src/images/sprite-sheet.png";
import BankedPastesSection from "./components/BankedPastesSection/BankedPastesSection.jsx";
import PageHeader from "./components/PageHeader/PageHeader.jsx";

function App() {
  useDocumentMeta("OSRS | Mixology Calculator", favicon);

  const [pasteTotals, setPasteTotals] = useState({
    totalMox: 0,
    totalAga: 0,
    totalLye: 0,
  });

  const [herbTotals, setHerbTotals] = useState({
    totalMox: 0,
    totalAga: 0,
    totalLye: 0,
  });

  const [itemTotals, setItemTotals] = useState({
    totalMox: 0,
    totalAga: 0,
    totalLye: 0,
    totalResin: 0,
  });

  const [selectedItems, setSelectedItems] = useState({});
  const [colorsLoaded, setColorsLoaded] = useState(false);

  const updatePasteTotals = useCallback((newTotals) => {
    setPasteTotals(newTotals);
  }, []);

  useEffect(() => {
    async function loadColors() {
      try {
        await extractColors(spriteSheetImage);
        setColorsLoaded(true);
      } catch (error) {
        setColorsLoaded(true); // Set to true even on error to allow app to render
      }
    }
    loadColors();
  }, []);

  const handleItemSelect = useCallback((itemKey, quantity) => {
    setSelectedItems((prevItems) => {
      if (quantity > 0) {
        return { ...prevItems, [itemKey]: quantity };
      } else {
        const { [itemKey]: _, ...rest } = prevItems;
        return rest;
      }
    });
  }, []);

  const updateHerbTotals = useCallback((newTotals) => {
    setHerbTotals(newTotals);
  }, []);

  const updateItemTotals = useCallback((newTotals) => {
    setItemTotals(newTotals);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedItems({});
    setHerbTotals({ totalMox: 0, totalAga: 0, totalLye: 0 });
    setItemTotals({ totalMox: 0, totalAga: 0, totalLye: 0, totalResin: 0 });
  }, []);

  const hasSelectedRewards = Object.keys(selectedItems).length > 0;

  if (!colorsLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <PageHeader />
      <section className="itemsUserWants">
        <h2>What items do you want?</h2>
        <p>
          Select the items that you want and the quantity from the options
          below.
        </p>
        <RewardSelection
          onItemSelect={handleItemSelect}
          selectedItems={selectedItems}
          rewardsData={rewards}
          updateItemTotals={updateItemTotals}
          colorsLoaded={colorsLoaded}
        />
      </section>
      <section className="herbloreConfiguration">
        <ProductProvider>
          <HerbloreConfiguration
            updateHerbTotals={updateHerbTotals}
            colorsLoaded={colorsLoaded}
          />
        </ProductProvider>
      </section>
      <section className="bankedPastesSection">
        <BankedPastesSection
          updatePasteTotals={updatePasteTotals}
          colorsLoaded={colorsLoaded}
        />
      </section>
      <section className="calculation-results">
        <ResourceCalculation
          herbTotals={herbTotals}
          pasteTotals={pasteTotals}
          itemTotals={itemTotals}
          hasSelectedRewards={hasSelectedRewards}
        />
      </section>
    </div>
  );
}

export default App;
