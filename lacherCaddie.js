function yourFunction(payload, queryParams, clientConfigs, DI, path) {
  if (payload?.job && payload?.job?.dropoffs?.length > 0) {
    // Pin code feature block
    try {
      function isMobilePhoneNumber(number) {
        return (
          number.startsWith("06") ||
          number.startsWith("07") ||
          number.startsWith("336") ||
          number.startsWith("336") ||
          number.startsWith("337") ||
          number.startsWith("3306") ||
          number.startsWith("3307") ||
          number.startsWith("00336") ||
          number.startsWith("00337")
        );
      }
      const dropoff = payload.job.dropoffs[0];
      let contactPhone = dropoff.contact?.phone;
      if (contactPhone && isMobilePhoneNumber(contactPhone)) {
        // Enable dynamic pin code
        payload.job.dropoffs[0].delivery_options = {
          pin_code: {
            enabled: true,
            type: "static",
          },
        };
      }
    } catch (e) {
      //prevent job not being created in case of error
      console.error("Carrefour's pin code error", payload, e);
    }
    const pickups = payload?.job?.pickups;
    const dropoffs = payload?.job?.dropoffs;
    const companyName = pickups?.[0]?.contact?.company || "";
    const companyNamesWithPickupAtToModify = [
      "LEX - Carrefour Market Paris Lyon - LEX",
    ]; // Shops for which we must modified the pickup_at: original_pickup_at + 10 minutes
    if (
      companyNamesWithPickupAtToModify.includes(companyName) &&
      payload.job?.pickup_at
    ) {
      const pickupAt = new Date(payload.job.pickup_at);
      pickupAt.setMinutes(pickupAt.getMinutes() + 10);
      const newPickupAt = pickupAt?.toISOString();
      payload.job.pickup_at = newPickupAt;
    }
    const companyNamesWithLowerPackageSize = [
      "LEX - Carrefour Market Bordeaux Delattre - LEX",
      "LEX - Carrefour City Bordeaux Juin - LEX",
      "LEX - Carrefour Market Bordeaux Saint Jean - LEX",
      "LEX - Carrefour Market Nantes Feydeau - LEX",
      "LEX - Carrefour City Nantes Grootaers - LEX",
      "LEX - Carrefour City Nantes Carnot - LEX",
      "LEX - Carrefour City Montpellier Laissac 7232 - LEX",
      "LEX - Carrefour Market Rennes 3 Isly - LEX",
      "LEX - Carrefour Market Rennes Bourg L évêque - LEX",
      "LEX - Carrefour City Rennes Alma - LEX",
      "LEX - Carrefour Market Rennes La Poterie - LEX",
      "LEX - Carrefour Market Rennes Villejean - LEX",
      "LEX - Carrefour City Rennes Voltaire - LEX",
      "LEX - Carrefour Express Rennes Rue de Nantes - LEX",
      "LEX - Carrefour Market Reims Gambetta 7762X - LEX",
      "LEX - Carrefour Market Le Havre Turenne - LEX",
      "LEX - Carrefour Market Le Havre Sanvic - LEX",
      "LEX - Carrefour City Orléans Grenier à Sel 8910 - LEX",
      "LEX - Carrefour Market Calais coeur de vie - LEX",
      "LEX - Carrefour Market Lille La Madeleine - LEX",
      "LEX - Carrefour City Caen Défense Passive - LEX",
      "LEX - Carrefour City Caen St Ouen - LEX",
      "LEX - Carrefour City Croix - LEX",
    ]; // Shops for which we must modified the package type: from L or XL to M
    dropoffs.forEach((d) => {
      const clientReference = d.client_reference;
      const isLacherCaddiePackage =
        !/^[0-9]+$/.test(clientReference) && !/^\d+bis$/.test(clientReference); // "Lacher caddie" references contain letters; non-"lacher caddie" are numeric, some ending with "bis."
      // If it is a "Lacher caddie" order multiply the initial weight by 2.
      const weight = isLacherCaddiePackage ? d.load * 2 : d.load;
      d.package_dimensions = {
        weight: {
          value: weight,
          unit: "kg",
        },
      };
      // For "Lacher caddie" orders:
      // - Set the package type to "l" if the weight is below 12kg; otherwise, set it to "xl".
      // - The package description should include only the weight, excluding volume information provided by Carrefour.
      if (isLacherCaddiePackage) {
        d.package_type = weight < 12 ? "large" : "xlarge";
        d.package_description = `Poids: ${weight} kg`;
      } else if (companyNamesWithLowerPackageSize.includes(companyName)) {
        if ("large" === d.package_type || "xlarge" === d.package_type) {
          d.package_type = "medium";
        }
      }
      // Add specific delivery instructions for orders from "Carrefour Aubervilliers".
      // - If the weight is below 10 kg, use instruction 1.
      // - Otherwise, use instruction 2.
      const companyNamesHyperAubervilliers = [
        "Carrefour LEX Paris Aubervilliers",
        "LEX - Carrefour Paris Aubervilliers - LEX",
        "F - Carrefour Aubervilliers 8947XX",
        "LEX - Carrefour Aubervilliers - LEX",
        "LEX -  Carrefour Aubervilliers - LEX",
      ];
      if (companyNamesHyperAubervilliers.includes(companyName)) {
        const instruction1 =
          "10 Rue Louis Gérard. Rentrer Porte 6 puis prendre l'escalier à droite (Le magasin se trouve en face de l'escalier au 1er étage) \n S'annoncer à l'accueil livraison sur la droite.";
        const instruction2 =
          "10 Rue Louis Gérard. Rentrer dans le parking gratuit (proche de la porte 6) \n Prendre l'ascenseur pour le 1er étage \n À gauche en sortant de l'ascenseur puis encore à gauche, le magasin se trouve au bout du couloir \n S'annoncer à l'accueil livraison sur la droite \n Caisses à rapporter à l'accueil livraison avant de partir du point de retrait";
        pickups[0].comment =
          `Poids: ${weight} kg` +
          "\n" +
          (weight < 10 ? instruction1 : instruction2);
      }
    });
    payload.job.dropoffs = dropoffs;
  }
  return payload;
}

// 12/12/2024
if (payload?.job && payload?.job?.dropoffs?.length > 0) {
  // Pin code feature block
  try {
    function isMobilePhoneNumber(number) {
      return (
        number.startsWith("06") ||
        number.startsWith("07") ||
        number.startsWith("336") ||
        number.startsWith("336") ||
        number.startsWith("337") ||
        number.startsWith("3306") ||
        number.startsWith("3307") ||
        number.startsWith("00336") ||
        number.startsWith("00337")
      );
    }
    const dropoff = payload.job.dropoffs[0];
    let contactPhone = dropoff.contact?.phone;
    if (contactPhone && isMobilePhoneNumber(contactPhone)) {
      // Enable dynamic pin code
      payload.job.dropoffs[0].delivery_options = {
        pin_code: {
          enabled: true,
          type: "static",
        },
      };
    }
  } catch (e) {
    //prevent job not being created in case of error
    console.error("Carrefour's pin code error", payload, e);
  }
  const pickups = payload?.job?.pickups;
  const dropoffs = payload?.job?.dropoffs;
  const companyName = pickups?.[0]?.contact?.company || "";
  const companyNamesWithPickupAtToModify = [
    "LEX - Carrefour Market Paris Lyon - LEX",
  ]; // Shops for which we must modified the pickup_at: original_pickup_at + 10 minutes
  if (
    companyNamesWithPickupAtToModify.includes(companyName) &&
    payload.job?.pickup_at
  ) {
    const pickupAt = new Date(payload.job.pickup_at);
    pickupAt.setMinutes(pickupAt.getMinutes() + 10);
    const newPickupAt = pickupAt?.toISOString();
    payload.job.pickup_at = newPickupAt;
  }
  const companyNamesWithLowerPackageSize = [
    "LEX - Carrefour Market Bordeaux Delattre - LEX",
    "LEX - Carrefour City Bordeaux Juin - LEX",
    "LEX - Carrefour Market Bordeaux Saint Jean - LEX",
    "LEX - Carrefour Market Nantes Feydeau - LEX",
    "LEX - Carrefour City Nantes Grootaers - LEX",
    "LEX - Carrefour City Nantes Carnot - LEX",
    "LEX - Carrefour City Montpellier Laissac 7232 - LEX",
    "LEX - Carrefour Market Rennes 3 Isly - LEX",
    "LEX - Carrefour Market Rennes Bourg L évêque - LEX",
    "LEX - Carrefour City Rennes Alma - LEX",
    "LEX - Carrefour Market Rennes La Poterie - LEX",
    "LEX - Carrefour Market Rennes Villejean - LEX",
    "LEX - Carrefour City Rennes Voltaire - LEX",
    "LEX - Carrefour Express Rennes Rue de Nantes - LEX",
    "LEX - Carrefour Market Reims Gambetta 7762X - LEX",
    "LEX - Carrefour Market Le Havre Turenne - LEX",
    "LEX - Carrefour Market Le Havre Sanvic - LEX",
    "LEX - Carrefour City Orléans Grenier à Sel 8910 - LEX",
    "LEX - Carrefour Market Calais coeur de vie - LEX",
    "LEX - Carrefour Market Lille La Madeleine - LEX",
    "LEX - Carrefour City Caen Défense Passive - LEX",
    "LEX - Carrefour City Caen St Ouen - LEX",
    "LEX - Carrefour City Croix - LEX",
  ]; // Shops for which we must modified the package type: from L or XL to M
  dropoffs.forEach((d) => {
    const clientReference = d.client_reference;
    const isLacherCaddiePackage =
      !/^[0-9]+$/.test(clientReference) && !/^\d+bis$/.test(clientReference); // "Lacher caddie" references contain letters; non-"lacher caddie" are numeric, some ending with "bis."
    // If it is a "Lacher caddie" order multiply the initial weight by 2.
    const weight = isLacherCaddiePackage ? d.load * 2 : d.load;
    d.package_dimensions = {
      weight: {
        value: weight,
        unit: "kg",
      },
    };
    // For "Lacher caddie" orders:
    // - The package type must be set to "xlarge".
    // - The package description should include only the weight, excluding volume information provided by Carrefour.
    if (isLacherCaddiePackage) {
      d.package_type = "xlarge";
      d.package_description = `Poids: ${weight} kg`;
    } else if (companyNamesWithLowerPackageSize.includes(companyName)) {
      if ("large" === d.package_type || "xlarge" === d.package_type) {
        d.package_type = "medium";
      }
    }
    // Add specific delivery instructions for orders from "Carrefour Aubervilliers".
    // - If the weight is below 10 kg, use instruction 1.
    // - Otherwise, use instruction 2.
    const companyNamesHyperAubervilliers = [
      "Carrefour LEX Paris Aubervilliers",
      "LEX - Carrefour Paris Aubervilliers - LEX",
      "F - Carrefour Aubervilliers 8947XX",
      "LEX - Carrefour Aubervilliers - LEX",
      "LEX -  Carrefour Aubervilliers - LEX",
    ];
    if (companyNamesHyperAubervilliers.includes(companyName)) {
      const instruction1 =
        "10 Rue Louis Gérard. Rentrer Porte 6 puis prendre l'escalier à droite (Le magasin se trouve en face de l'escalier au 1er étage) \n S'annoncer à l'accueil livraison sur la droite.";
      const instruction2 =
        "10 Rue Louis Gérard. Rentrer dans le parking gratuit (proche de la porte 6) \n Prendre l'ascenseur pour le 1er étage \n À gauche en sortant de l'ascenseur puis encore à gauche, le magasin se trouve au bout du couloir \n S'annoncer à l'accueil livraison sur la droite \n Caisses à rapporter à l'accueil livraison avant de partir du point de retrait";
      pickups[0].comment =
        `Poids: ${weight} kg` +
        "\n" +
        (weight < 10 ? instruction1 : instruction2);
    }
  });
  payload.job.dropoffs = dropoffs;
}
return payload;
