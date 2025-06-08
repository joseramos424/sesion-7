"use client"

import { useState } from "react"
import { PlayIcon } from "lucide-react"

type Answer = "option1" | "option2" | "option3" | "option4" | null

export default function MultipleChoiceActivity({
  onComplete,
  recordings,
}: {
  onComplete: () => void
  recordings: { [key: number]: string }
}) {
  // Estado para controlar qué pregunta se está reproduciendo
  const [playingId, setPlayingId] = useState<number | null>(null)

  // Estado para mostrar el modal de advertencia
  const [feedback, setFeedback] = useState<{
    show: boolean
    type: "success" | "warning" | "alert"
    message: string
  }>({
    show: false,
    type: "success",
    message: "",
  })

  // Estado para las respuestas del usuario
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: Answer }>({
    1: null,
    2: null,
    3: null,
    4: null,
  })

  // Función para reproducir una grabación
  const playRecording = (questionId: number) => {
    // Si hay una reproducción en curso, detenerla
    if (playingId !== null) {
      const currentAudio = document.getElementById(`audio-${playingId}`) as HTMLAudioElement
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }

    // Reproducir la nueva grabación
    const audio = document.getElementById(`audio-${questionId}`) as HTMLAudioElement
    if (audio) {
      setPlayingId(questionId)

      audio.onended = () => {
        setPlayingId(null)
      }

      audio.play().catch((error) => {
        console.error("Error al reproducir el audio:", error)
        setPlayingId(null)
      })
    }
  }

  // Función para manejar la selección de respuestas
  const handleAnswerChange = (questionId: number, value: Answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  // Verificar si se han respondido todas las preguntas
  const allQuestionsAnswered = Object.values(userAnswers).every((answer) => answer !== null)

  // Función para continuar a la siguiente parte
  const handleContinue = () => {
    // Verificar si todas las preguntas han sido respondidas
    if (allQuestionsAnswered) {
      // Contar cuántas respuestas son "No lo sé"
      const dontKnowCount = Object.values(userAnswers).filter((answer) => answer === "option4").length

      if (dontKnowCount === 0) {
        // Caso 1: No ha marcado "No lo sé" en ninguna pregunta
        setFeedback({
          show: true,
          type: "success",
          message: "Has respondido bien a todo. ¡Enhorabuena! Si quieres puedes volver a escuchar el cuento.",
        })
      } else if (dontKnowCount === 1) {
        // Caso 2: Ha marcado "No lo sé" en exactamente una pregunta
        setFeedback({
          show: true,
          type: "warning",
          message: 'Has respondido "No lo sé" a una pregunta. Si quieres puedes volver a escuchar el cuento.',
        })
      } else {
        // Caso 3: Ha marcado "No lo sé" en más de una pregunta
        setFeedback({
          show: true,
          type: "alert",
          message:
            'Has respondido "No lo sé" a varias preguntas. Te recomendamos volver a escuchar el cuento para comprender mejor la historia.',
        })
      }
    }
  }

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({ ...prev, show: false }))
    onComplete()
  }

  // Función para reiniciar la actividad (volver a escuchar el texto)
  const handleRestart = () => {
    // Aquí implementaríamos la lógica para volver a la primera actividad
    window.location.reload() // Solución temporal: recargar la página
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
      {/* Header con título */}
      <div className="mb-6">
        <h1 className="text-blue-500 font-medium text-lg">Lección 1. Escucho y hablo</h1>
        <h2 className="text-gray-600 text-md mt-1">El libro de la selva: Capítulo 1</h2>
      </div>

      {/* Contenido principal */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-medium text-center">Comprueba tus respuestas</h3>
        </div>

        {/* Pregunta 1 */}
        <div className="mb-8">
          <button
            onClick={() => playRecording(1)}
            disabled={!recordings[1]}
            className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 p-3 rounded-lg mb-4 transition-colors"
            aria-label="Reproducir tu respuesta a la pregunta 1"
          >
            <div
              className={`flex items-center justify-center rounded-full w-8 h-8 ${
                playingId === 1 ? "bg-blue-600 animate-pulse" : "bg-blue-600"
              }`}
            >
              <PlayIcon size={18} className="text-white" />
            </div>
            <span className="font-medium">1 ¿Dónde ocurre el cuento?</span>
          </button>

          {/* Audio element (hidden) */}
          {recordings[1] && <audio id="audio-1" src={recordings[1]} style={{ display: "none" }} />}

          <div className="pl-4">
            <p className="mb-2 text-gray-700">Mi respuesta se parece a:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="q1-option1"
                  name="question1"
                  className="mr-2"
                  checked={userAnswers[1] === "option1"}
                  onChange={() => handleAnswerChange(1, "option1")}
                />
                <label htmlFor="q1-option1">En el campo</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q1-option3"
                  name="question1"
                  className="mr-2"
                  checked={userAnswers[1] === "option3"}
                  onChange={() => handleAnswerChange(1, "option3")}
                />
                <label htmlFor="q1-option3">En el río</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q1-option2"
                  name="question1"
                  className="mr-2"
                  checked={userAnswers[1] === "option2"}
                  onChange={() => handleAnswerChange(1, "option2")}
                />
                <label htmlFor="q1-option2">En la selva</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q1-option4"
                  name="question1"
                  className="mr-2"
                  checked={userAnswers[1] === "option4"}
                  onChange={() => handleAnswerChange(1, "option4")}
                />
                <label htmlFor="q1-option4">No lo sé</label>
              </div>
            </div>
          </div>
        </div>

        {/* Pregunta 2 */}
        <div className="mb-8">
          <button
            onClick={() => playRecording(2)}
            disabled={!recordings[2]}
            className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 p-3 rounded-lg mb-4 transition-colors"
            aria-label="Reproducir tu respuesta a la pregunta 2"
          >
            <div
              className={`flex items-center justify-center rounded-full w-8 h-8 ${
                playingId === 2 ? "bg-blue-600 animate-pulse" : "bg-blue-600"
              }`}
            >
              <PlayIcon size={18} className="text-white" />
            </div>
            <span className="font-medium">2 ¿Cómo se llama el niño del cuento?</span>
          </button>

          {/* Audio element (hidden) */}
          {recordings[2] && <audio id="audio-2" src={recordings[2]} style={{ display: "none" }} />}

          <div className="pl-4">
            <p className="mb-2 text-gray-700">Mi respuesta se parece a:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="q2-option1"
                  name="question2"
                  className="mr-2"
                  checked={userAnswers[2] === "option1"}
                  onChange={() => handleAnswerChange(2, "option1")}
                />
                <label htmlFor="q2-option1">Monti</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q2-option3"
                  name="question2"
                  className="mr-2"
                  checked={userAnswers[2] === "option3"}
                  onChange={() => handleAnswerChange(2, "option3")}
                />
                <label htmlFor="q2-option3">Moni</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q2-option2"
                  name="question2"
                  className="mr-2"
                  checked={userAnswers[2] === "option2"}
                  onChange={() => handleAnswerChange(2, "option2")}
                />
                <label htmlFor="q2-option2">Mowgli</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q2-option4"
                  name="question2"
                  className="mr-2"
                  checked={userAnswers[2] === "option4"}
                  onChange={() => handleAnswerChange(2, "option4")}
                />
                <label htmlFor="q2-option4">No lo sé</label>
              </div>
            </div>
          </div>
        </div>

        {/* Pregunta 3 */}
        <div className="mb-8">
          <button
            onClick={() => playRecording(3)}
            disabled={!recordings[3]}
            className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 p-3 rounded-lg mb-4 transition-colors"
            aria-label="Reproducir tu respuesta a la pregunta 3"
          >
            <div
              className={`flex items-center justify-center rounded-full w-8 h-8 ${
                playingId === 3 ? "bg-blue-600 animate-pulse" : "bg-blue-600"
              }`}
            >
              <PlayIcon size={18} className="text-white" />
            </div>
            <span className="font-medium">3 ¿Dónde encontró Papá Lobo a Mowgli?</span>
          </button>

          {/* Audio element (hidden) */}
          {recordings[3] && <audio id="audio-3" src={recordings[3]} style={{ display: "none" }} />}

          <div className="pl-4">
            <p className="mb-2 text-gray-700">Mi respuesta se parece a:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="q3-option1"
                  name="question3"
                  className="mr-2"
                  checked={userAnswers[3] === "option1"}
                  onChange={() => handleAnswerChange(3, "option1")}
                />
                <label htmlFor="q3-option1">En la selva</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q3-option3"
                  name="question3"
                  className="mr-2"
                  checked={userAnswers[3] === "option3"}
                  onChange={() => handleAnswerChange(3, "option3")}
                />
                <label htmlFor="q3-option3">Al lado del río</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q3-option2"
                  name="question3"
                  className="mr-2"
                  checked={userAnswers[3] === "option2"}
                  onChange={() => handleAnswerChange(3, "option2")}
                />
                <label htmlFor="q3-option2">En el río</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q3-option4"
                  name="question3"
                  className="mr-2"
                  checked={userAnswers[3] === "option4"}
                  onChange={() => handleAnswerChange(3, "option4")}
                />
                <label htmlFor="q3-option4">No lo sé</label>
              </div>
            </div>
          </div>
        </div>

        {/* Pregunta 4 */}
        <div className="mb-8">
          <button
            onClick={() => playRecording(4)}
            disabled={!recordings[4]}
            className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 p-3 rounded-lg mb-4 transition-colors"
            aria-label="Reproducir tu respuesta a la pregunta 4"
          >
            <div
              className={`flex items-center justify-center rounded-full w-8 h-8 ${
                playingId === 4 ? "bg-blue-600 animate-pulse" : "bg-blue-600"
              }`}
            >
              <PlayIcon size={18} className="text-white" />
            </div>
            <span className="font-medium">4 ¿Dónde estaba Mamá Loba?</span>
          </button>

          {/* Audio element (hidden) */}
          {recordings[4] && <audio id="audio-4" src={recordings[4]} style={{ display: "none" }} />}

          <div className="pl-4">
            <p className="mb-2 text-gray-700">Mi respuesta se parece a:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="q4-option1"
                  name="question4"
                  className="mr-2"
                  checked={userAnswers[4] === "option1"}
                  onChange={() => handleAnswerChange(4, "option1")}
                />
                <label htmlFor="q4-option1">Con sus cachorros</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q4-option3"
                  name="question4"
                  className="mr-2"
                  checked={userAnswers[4] === "option3"}
                  onChange={() => handleAnswerChange(4, "option3")}
                />
                <label htmlFor="q4-option3">En la cueva con sus cachorros</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q4-option2"
                  name="question4"
                  className="mr-2"
                  checked={userAnswers[4] === "option2"}
                  onChange={() => handleAnswerChange(4, "option2")}
                />
                <label htmlFor="q4-option2">En la cueva</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="q4-option4"
                  name="question4"
                  className="mr-2"
                  checked={userAnswers[4] === "option4"}
                  onChange={() => handleAnswerChange(4, "option4")}
                />
                <label htmlFor="q4-option4">No lo sé</label>
              </div>
            </div>
          </div>
        </div>

        {/* Botón para continuar */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className={`px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors ${
              allQuestionsAnswered ? "animate-pulse" : ""
            }`}
            disabled={!allQuestionsAnswered}
          >
            {allQuestionsAnswered ? "Continuar" : "Responde a todas las preguntas"}
          </button>
        </div>
      </div>

      {/* Modal de feedback - aparece siempre al completar */}
      {feedback.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
            <div className="text-center mb-4">
              <div
                className={`text-2xl font-bold ${
                  feedback.type === "success"
                    ? "text-green-600"
                    : feedback.type === "warning"
                      ? "text-yellow-600"
                      : "text-yellow-600"
                }`}
              >
                {feedback.type === "success"
                  ? "¡Enhorabuena!"
                  : feedback.type === "warning"
                    ? "¡Atención!"
                    : "¡Atención!"}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-center text-lg mb-4">{feedback.message}</p>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={handleRestart} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Volver a escuchar
              </button>
              <button
                onClick={handleCloseFeedback}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
