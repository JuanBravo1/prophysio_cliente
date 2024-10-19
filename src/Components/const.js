const warningTranslations = {
    "This is a top-10 common password": "Esta es una de las 10 contraseñas más comunes",
    "This is a top-100 common password": "Esta es una de las 100 contraseñas más comunes",
    "This is a very common password": "Esta es una contraseña muy común",
    "This is similar to a commonly used password": "Esta contraseña es similar a una comúnmente utilizada",
    "A word by itself is easy to guess": "Una sola palabra es fácil de adivinar",
    "Names and surnames by themselves are easy to guess": "Nombres y apellidos son fáciles de adivinar",
    "Dates are often easy to guess": "Las fechas suelen ser fáciles de adivinar",
    "Repeats like 'aaa' are easy to guess": "Repeticiones como 'aaa' son fáciles de adivinar",
    "Sequences like 'abc' are easy to guess": "Secuencias como 'abc' son fáciles de adivinar",
    "This is a well-known pattern": "Este es un patrón muy conocido",
    "Using keyboard patterns like 'qwerty' is easy to guess": "Los patrones de teclado como 'qwerty' son fáciles de adivinar"
};
const suggestionTranslations = {
    "Add another word or two. Uncommon words are better.": "Agrega otra palabra o dos. Las palabras poco comunes son mejores.",
    "Avoid repeated words and characters": "Evita palabras y caracteres repetidos",
    "Avoid sequences": "Evita secuencias",
    "Avoid predictable substitutions like '@' for 'a'": "Evita sustituciones predecibles como '@' por 'a'",
    "Use a few words, avoid common phrases": "Usa algunas palabras, evita frases comunes",
    "No need for symbols, digits, or uppercase letters": "No es necesario usar símbolos, dígitos o letras mayúsculas",
    "Consider using a longer password": "Considera usar una contraseña más larga",
    "Avoid using common names or surnames": "Evita usar nombres o apellidos comunes"
};

const translateFeedback = (feedback) => {
    const { suggestions, warning } = feedback;
    
    // Traducir advertencia
    const translatedWarning = warningTranslations[warning] || warning;
  
    // Traducir sugerencias
    const translatedSuggestions = suggestions
      .map(suggestion => suggestionTranslations[suggestion] || suggestion)
      .join(' ');
  
    return `${translatedWarning} ${translatedSuggestions}`.trim();
  };
  

export { translateFeedback ,suggestionTranslations, warningTranslations }