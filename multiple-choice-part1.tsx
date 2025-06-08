"use client"

import type React from "react"

import { useState } from "react"
import { PlayIcon } from "lucide-react"

type Answer = "option1" | "option2" | "option3" | "option4" | null

export default function MultipleChoicePart1({
  onComplete,
  recordings,
  setUserAnswers,
  userAnswers,
}: {
  onComplete: () => void
  recordings: { [key: number]: string }
  setUserAnswers: React.Dispatch<React.SetStateAction<{ [key: number]: Answer }>>
  userAnswers: { [key: number]: Answer }
}) {
  // Estado para controlar qué pregunta se está reproduciendo
  const [playingId, setPlayingId] = useState<number | null>(null)

  // Estado para mostrar el modal de advertencia
  const [showWarning, setShowWarning] = useState(false)

  // Función para reproducir una grabación
  const playRecording = (questionId: number) => {
    const audio = new Audio(recordings[questionId])
    setPlayingId(questionId)

    audio.onended = () => {
      setPlayingId(null)
    }

    audio.play().catch((error) => {
      console.error("Error al reproducir el audio:", error)
      setPlayingId(null)
    })
  }

  // Función para manejar la selección de respuestas
  const handleAnswerChange = (questionId: number, value: Answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  // Verificar si se han respondido ambas preguntas
  const allQuestionsAnswered = userAnswers[1] !== null && userAnswers[2] !== null

  // Función para continuar a la siguiente parte
  const handleContinue = () => {
    // Verificar si hay más de una respuesta "No lo sé"
    const dontKnowCount = Object.values(userAnswers).filter((answer) => answer === "option4" || answer === null).length

    if (dontKnowCount >= 2) {
      setShowWarning(true)
    } else {
      onComplete()
    }
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

        {/* Botón para continuar */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className={`px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors ${
              allQuestionsAnswered ? "animate-pulse" : ""
            }`}
            disabled={!allQuestionsAnswered}
          >
            Continuar
          </button>
        </div>
      </div>

      {/* Modal de advertencia */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-yellow-600">¡Atención!</div>
            </div>

            <div className="mb-6">
              <p className="text-center text-lg mb-4">
                Has respondido "No lo sé" a varias preguntas. Te recomendamos volver a escuchar el cuento para
                comprender mejor la historia.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Continuar de todos modos
              </button>
              <button onClick={handleRestart} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Volver a escuchar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
