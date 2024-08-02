const verbs = ['Estar', 'Hablar', 'Ser'];

const audioPlayer = document.getElementById('audioPlayer');
const spanishFirst = document.getElementById('answer-first');
const translate = document.getElementById('translate');
const verbText = document.getElementById('verb');
const dropdown = document.getElementById('real-words-type');

var audioPathIndex = -1;
var audioPath = '';
var firstWord = true;

// const pronounsSpanish = [
//   'Yo',
//   'Tu',
//   'Usted',
//   'El',
//   'Ella',
//   'Nosotros',
//   'Ustedes',
//   'Ellos',
//   'Ellas',
// ];

const pronounsSpanish = ['Yo', 'Tu', 'El', 'Ella'];

var chosenVerb = 'All';
var audioSpanishWords = [];
var audioEnglishWords = [];

StoreVerbs();
SetDropdown();

function StoreVerbs() {
  audioSpanishWords = [];
  audioEnglishWords = [];

  if (chosenVerb == 'All') {
    verbs.forEach((verb) => {
      pronounsSpanish.forEach((pronoun) => {
        audioSpanishWords.push(
          `verbs/${verb.toLowerCase()}/${pronoun.toLowerCase()}_w.mp3`
        );
        audioEnglishWords.push(
          `verbs/${verb.toLowerCase()}/${pronoun.toLowerCase()}_t.mp3`
        );
      });
    });
  } else {
    pronounsSpanish.forEach((pronoun) => {
      audioSpanishWords.push(
        `verbs/${chosenVerb.toLowerCase()}/${pronoun.toLowerCase()}_w.mp3`
      );
      audioEnglishWords.push(
        `verbs/${chosenVerb.toLowerCase()}/${pronoun.toLowerCase()}_t.mp3`
      );
    });
  }

  firstWord = true;
  SetRandomVerb();
}

function SetDropdown() {
  verbs.forEach((verb) => {
    var option = document.createElement('option');
    option.value = verb;
    option.text = verb;
    dropdown.add(option);
  });
}

dropdown.addEventListener('change', function (event) {
  chosenVerb = event.target.value;
  StoreVerbs();
  StopAudio();
});

function PlayAudio() {
  audioPlayer.src = audioPath;
  audioPlayer.play();
  console.log(audioPath);
  verbText.innerHTML =
    pronounsSpanish[audioPathIndex % 4] + ' ' + GetSpanishVerb();
}

function StopAudio() {
  verbText.innerHTML = '...';
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  firstWord = true;
  SetRandomVerb();
}

audioPlayer.addEventListener('ended', () => {
  if (translate.checked && (!spanishFirst.checked || spanishFirst.checked)) {
    firstWord = !firstWord;
  }

  if (firstWord) {
    SetRandomVerb();
  } else {
    if (spanishFirst.checked) {
      audioPath = audioEnglishWords[audioPathIndex];
    } else {
      audioPath = audioSpanishWords[audioPathIndex];
    }
  }

  audioPlayer.src = audioPath;
  PlayAudio();

  console.log(audioPlayer.src);
});

spanishFirst.addEventListener('change', function () {
  StopAudio();

  if (!translate.checked) {
    spanishFirst.checked = true;
  }
});

translate.addEventListener('change', function () {
  StopAudio();

  if (!translate.checked) {
    spanishFirst.checked = true;
  }
});

function GetRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function SetRandomVerb() {
  audioPathIndex = GetRandomInt(0, audioSpanishWords.length - 1);

  if (spanishFirst.checked || (!spanishFirst.checked && !translate.checked)) {
    audioPath = audioSpanishWords[audioPathIndex];
  } else {
    audioPath = audioEnglishWords[audioPathIndex];
  }
}

function GetSpanishVerb() {
  if (audioPath.includes('_w')) {
    return audioPath.split('/')[2].split('_w')[0];
  } else if (audioPath.includes('_t')) {
    return audioPath.split('/')[2].split('_t')[0];
  }
}
