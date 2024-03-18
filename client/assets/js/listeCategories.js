const subcategories = {
    "Littérature et Poésie": [
      "Romans",
      "Nouvelles",
      "Science-fiction",
      "Fantaisie",
      "Mystère/Thriller",
      "Romance",
      "Aventure",
      "Littérature classique",
      "Littérature contemporaine",
      "Poésie",
      "Théâtre"
    ],
    "Non-fiction": [
      "Biographies et Mémoires",
      "Cuisine et Gastronomie"
    ],
    "Arts et Divertissement": [
      "Art et photographie",
      "Musique",
      "Cinéma et Télévision",
      "Sports et Loisirs",
      "Jeux et Loisirs créatifs"
    ],
    "Enfants et Jeunes Adultes": [
      "Livres pour enfants",
      "Littérature pour jeunes adultes",
      "Contes de fées et Folklore",
      "Livres éducatifs pour enfants"
    ],
    "Références et Outils": [
      "Dictionnaires",
      "Encyclopédies",
      "Manuels scolaires",
      "Guides de voyage",
      "Livres de cuisine",
      "Guides pratiques (bricolage, jardinage, etc.)"
    ],
    "Religions et Spiritualité": [
      "Livres sacrés",
      "Théologie",
      "Spiritualité",
      "Livres religieux spécifiques (Bible, Coran, Bhagavad Gita, etc.)"
    ],
    "Histoire et Culture": [
      "Histoire régionale",
      "Culture et Traditions",
      "Anthropologie"
    ],
    "Sciences Sociales": [
      "Psychologie",
      "Sociologie",
      "Sciences politiques",
      "Économie"
    ],
    "Science et Technologie": [
      "Sciences naturelles (biologie, physique, chimie)",
      "Sciences appliquées (informatique, ingénierie)",
      "Technologie",
      "Médecine et Santé"
    ],
    "Langues et Linguistique": [
      "Livres dans des langues étrangères",
      "Linguistique et études de langues"
    ],
    "Autres": [
      "Livres audio",
      "Bandes dessinées et romans graphiques",
      "Littérature érotique",
      "Livres rares et anciens",
      "Livres numériques (e-books)"
    ]
  };

  function creerOptionsSelect(categories) {
    const select = $('#categorieFilter');
    for (const categorie in categories) {
        const optgroup = $('<optgroup>').attr('label', categorie);
        categories[categorie].forEach(sousCategorie => {
            optgroup.append($('<option>').text(sousCategorie).val(sousCategorie));
        });
        select.append(optgroup);
    }
  }