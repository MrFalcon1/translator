document
  .getElementById("translateButton")
  .addEventListener("click", async () => {
    const inputText = document.getElementById("inputText").value;
    const outputDiv = document.getElementById("outputText");

    if (!inputText.trim()) {
      outputDiv.textContent = "Iltimos, matn kiriting.";
      return;
    }

    try {
      const response = await fetch(
        "https://api.mymemory.translated.net/get?q=" +
          encodeURIComponent(inputText) +
          "&langpair=en|uz"
      );
      const data = await response.json();
      outputDiv.textContent = data.responseData.translatedText;
    } catch (error) {
      outputDiv.textContent =
        "Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.";
    }
  });

const recognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

if (recognition) {
  const speechRecognition = new recognition();
  speechRecognition.lang = "en-US";

  document.getElementById("voiceButton").addEventListener("click", () => {
    const outputDiv = document.getElementById("outputText");
    outputDiv.textContent = "Iltimos, gapiring...";

    speechRecognition.start();

    speechRecognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      document.getElementById("inputText").value = spokenText;

      try {
        const response = await fetch(
          "https://api.mymemory.translated.net/get?q=" +
            encodeURIComponent(spokenText) +
            "&langpair=en|uz"
        );
        const data = await response.json();
        const translatedText = data.responseData.translatedText;
        outputDiv.textContent = translatedText;

        // Ovoz chiqarish
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = "uz-UZ";
        synth.speak(utterance);
      } catch (error) {
        outputDiv.textContent =
          "Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.";
      }
    };

    speechRecognition.onerror = () => {
      outputDiv.textContent = "Ovozni aniqlashda xatolik yuz berdi.";
    };
  });
} else {
  document.getElementById("voiceButton").disabled = true;
  alert("Brauzeringiz ovozli kirishni qo‘llab-quvvatlamaydi.");
}