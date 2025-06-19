// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.
//  Il tipo deve includere le seguenti proprietà:
//      id: numero identificativo, non modificabile
//      name: nome completo, stringa non modificabile
//      birth_year: anno di nascita, numero
//      death_year: anno di morte, numero opzionale
//      biography: breve biografia, stringa
//      image: URL dell'immagine, stringa
type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:
//  most_famous_movies: una tuple di 3 stringhe
//  awards: una stringa
//  nationality: una stringa tra un insieme definito di valori.
//      Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.
type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nazionality:
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese";
};

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:
//  GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.
// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.
const actressNationalities = [
  "American",
  "British",
  "Australian",
  "Israeli-American",
  "South African",
  "French",
  "Indian",
  "Israeli",
  "Spanish",
  "South Korean",
  "Chinese",
];

function isActress(data: unknown): data is Actress {
  if (
    // controlli generici
    data &&
    typeof data === "object" &&
    data !== null &&
    // Person
    "id" in data &&
    typeof data.id === "number" &&
    "name" in data &&
    typeof data.name === "string" &&
    "birth_year" in data &&
    typeof data.birth_year === "number" &&
    "death_year" in data &&
    typeof data.death_year === "number" &&
    "biography" in data &&
    typeof data.biography === "string" &&
    "image" in data &&
    typeof data.image === "string" &&
    // Actress
    "most_famous_movies" in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every((m) => typeof m === "string") &&
    "awards" in data &&
    typeof data.awards === "string" &&
    "nazionality" in data &&
    typeof data.nazionality === "string" &&
    actressNationalities.includes(data.nazionality)
  ) {
    return true;
  }
  return false;
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const res = await fetch(`http://localhost:5000/actresses/${id}`);
    if (!res.ok) {
      throw new Error(`Errore ${res.status}: ${res.statusText}`);
    }
    const data: unknown = await res.json();
    if (isActress(data)) {
      return data;
    }
    throw new Error("Dati non validi");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Errore:", error.message);
    } else {
      console.log("Errore sconosciuto:", error);
    }
    return null;
  }
}

// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:
//  GET /actresses
// La funzione deve restituire un array di oggetti Actress.
// Può essere anche un array vuoto.
async function getAllActresses(): Promise<Actress[]> {
  try {
    const res = await fetch("http://localhost:5000/actresses");
    if (!res.ok) {
      throw new Error(`Errore ${res.status}: ${res.statusText}`);
    }
    const data: unknown[] = await res.json();
    // if (Array.isArray(data) && data.every(isActress)) {
    //   return data;
    // }
    const attriciPresenti = data.filter(isActress);
    return attriciPresenti;

    // return [];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore nel recupero dei dati", error);
    }
    throw new Error("Dati non validi");
  }
}

// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).
async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map((id: number) => getActress(id));
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero dei dati:", error);
    } else {
      console.error("Errore:", error);
    }
    return [];
  }
}

// 🎯 BONUS 1
// Crea le funzioni:
//  createActress
//  updateActress
// Utilizza gli Utility Types:
//  Omit: per creare un'attrice senza passare id, che verrà generato casualmente.
//  Partial: per permettere l’aggiornamento di qualsiasi proprietà tranne id e name.

// function createActress(newActress: Actress): <Actress> {

// return newActress;
// }

// 🎯 BONUS 2
// Crea un tipo Actor, che estende Person con le seguenti differenze rispetto ad Actress:
//  known_for: una tuple di 3 stringhe
//  awards: array di una o due stringhe
//  nationality: le stesse di Actress più:
//      Scottish, New Zealand, Hong Kong, German, Canadian, Irish.
// Implementa anche le versioni getActor, getAllActors, getActors, createActor, updateActor.

// 🎯 BONUS 3
// Crea la funzione createRandomCouple che usa getAllActresses e getAllActors per restituire un’array che ha sempre due elementi:
// al primo posto una Actress casuale e al secondo posto un Actor casuale.
