import whisper
import sounddevice as sd
from scipy.io.wavfile import write
from search import search

SAMPLE_RATE = 16000
DURATION = 5

print("Loading Whisper model...")
model = whisper.load_model("tiny")


def record_audio():

    print("Speak now...")

    recording = sd.rec(
        int(DURATION * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=1,
        device=3
    )

    sd.wait()

    write("voice_new_query.wav", SAMPLE_RATE, recording)

    print("Recording saved")


def voice_search():

    record_audio()

    print("Transcribing...")

    result = model.transcribe("voice_new_query.wav")

    query = result["text"]

    print("\nYou said:", query)

    results = search(query)

    print("\nTop results:")

    for r in results:
        print(r)


if __name__ == "__main__":
    voice_search()