// Christmas quotes localized in different languages from the remote source
// Spanish (es) and French (fr) quotes sourced from the community JSON
// English quotes are the default fallback
// More languages will be added as they become available

export const localizedChristmasQuotes: Record<string, string[]> = {
  en: [
    "Christmas is not a time nor a season, but a state of mind.",
    "The best way to spread Christmas cheer is singing loud for all to hear.",
    "Christmas waves a magic wand over this world, and behold, everything is softer and more beautiful.",
    "Christmas isn't a season. It's a feeling.",
    "Peace on earth will come to stay, when we live Christmas every day.",
    "Christmas is doing a little something extra for someone.",
    "The joy of brightening other lives becomes for us the magic of the holidays.",
    "Christmas is the day that holds all time together.",
    "Christmas is the spirit of giving without a thought of getting.",
    "He who has not Christmas in his heart will never find it under a tree.",
    "At Christmas, all roads lead home.",
    "Blessed is the season which engages the whole world in a conspiracy of love.",
    "Christmas is love, wrapped in hope and tied with joy.",
    "Christmas is not about opening gifts, but about opening your heart.",
    "The best of all gifts around any Christmas tree: the presence of a happy family all wrapped up in each other."
  ],
  es: [
    "La Navidad no es un tiempo ni una estación, sino un estado de ánimo.",
    "La mejor manera de difundir la alegría navideña es cantar en voz alta para que todos lo escuchen.",
    "La Navidad mueve una varita mágica sobre este mundo, y he aquí, todo es más suave y más hermoso.",
    "La Navidad no es una estación. Es un sentimiento.",
    "La paz en la tierra llegará para quedarse, cuando vivamos la Navidad todos los días.",
    "La Navidad es hacer algo extra por alguien.",
    "La alegría de alegrar vidas ajenas se convierte para nosotros en la magia de las fiestas.",
    "La Navidad es el día que une todos los tiempos.",
    "La Navidad es el espíritu de dar sin pensar en recibir.",
    "Quien no tiene la Navidad en su corazón, nunca la encontrará debajo de un árbol.",
    "En Navidad, todos los caminos llevan a casa.",
    "Bendita la temporada que involucra al mundo entero en una conspiración de amor.",
    "La Navidad es amor, envuelto en esperanza y ligado a la alegría.",
    "La Navidad no se trata de abrir regalos, sino de abrir el corazón.",
    "El mejor de los regalos alrededor de cualquier árbol de Navidad: la presencia de una familia feliz, todos abrazados."
  ],
  fr: [
    "Noël n'est pas une période ni une saison, mais un état d'esprit.",
    "La meilleure façon de répandre la joie de Noël est de chanter fort pour que tout le monde puisse l'entendre.",
    "Noël agite une baguette magique sur ce monde, et voici, tout est plus doux et plus beau.",
    "Noël n'est pas une saison. C'est un sentiment.",
    "La paix sur terre viendra quand nous vivrons Noël tous les jours.",
    "Noël, c'est faire un petit quelque chose en plus pour quelqu'un.",
    "La joie d'égayer la vie des autres devient pour nous la magie des vacances.",
    "Noël est le jour qui rassemble tous les temps.",
    "Noël est l'esprit de donner sans penser à recevoir.",
    "Celui qui n'a pas Noël dans le cœur ne le trouvera jamais sous un sapin.",
    "A Noël, tous les chemins mènent à la maison.",
    "Bénie soit la saison qui engage le monde entier dans une conspiration d'amour.",
    "Noël est amour, enveloppé d'espoir et lié de joie.",
    "Noël ne consiste pas à ouvrir des cadeaux, mais à ouvrir son cœur.",
    "Le meilleur de tous les cadeaux autour d'un sapin de Noël : la présence d'une famille heureuse."
  ]
};

export function getChristmasQuotes(language: string): string[] {
  // Return localized quotes if available, otherwise fall back to English
  return localizedChristmasQuotes[language] || localizedChristmasQuotes.en;
}
