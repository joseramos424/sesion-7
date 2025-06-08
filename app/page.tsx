"use client"

import { useState } from "react"
import AudioActivity from "../audio-activity"
import VoiceRecordingActivity from "../voice-recording-activity"
import MultipleChoiceActivity from "../multiple-choice-activity"
import TextTranscription from "../text-transcription"

export default function Page() {
  const [currentActivity, setCurrentActivity] = useState(1)

  // Estado para almacenar las grabaciones
  const [recordings, setRecordings] = useState<{ [key: number]: string }>({})

  // Función para avanzar a la siguiente actividad
  const goToNextActivity = () => {
    setCurrentActivity(currentActivity + 1)
  }

  // Función para finalizar todas las actividades
  const finishActivities = () => {
    console.log("Todas las actividades completadas")
    // Aquí puedes añadir lógica adicional para cuando se completen todas las actividades
  }

  return (
    <div className="container mx-auto py-8">
      {currentActivity === 1 ? (
        <AudioActivity onComplete={goToNextActivity} />
      ) : currentActivity === 2 ? (
        <VoiceRecordingActivity
          onComplete={(recordedAudio) => {
            setRecordings(recordedAudio)
            goToNextActivity()
          }}
        />
      ) : currentActivity === 3 ? (
        <MultipleChoiceActivity onComplete={goToNextActivity} recordings={recordings} />
      ) : (
        <TextTranscription onComplete={finishActivities} />
      )}
    </div>
  )
}
