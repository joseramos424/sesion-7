"use client"

import { useState, useEffect } from "react"
import { PauseIcon } from "lucide-react"

// Componente personalizado para el icono de audio con ondas de sonido
const AudioIcon = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <path d="M15 8a5 5 0 0 1 0 8" />
      <path d="M18 5a9 9 0 0 1 0 14" />
    </svg>
  )
}

export default function AudioActivity({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  // Texto modificado de la historia de Mowgli con diálogos más claros y sin coma en la pregunta
  const storyText = [
    "Mowgli era un niño pequeño que vivía en una selva verde, con árboles muy altos.",
    "Mowgli no era un niño común.",
    "Una familia de lobos cuidó de Mowgli desde que era un bebé.",
    "Todo comenzó cuando Papá Lobo encontró al pequeño Mowgli cerca de un río.",
    "Mowgli estaba solo.",
    "El bebé sonrió al ver al lobo.",
    "Papá Lobo decidió llevarlo a su cueva.",
    "Allí Mamá Loba cuidaba de sus propios cachorros.",
    "Mamá Loba pregunta: ¿Qué traes ahí papá Lobo?", // Eliminada la coma para mejorar la entonación
    "Papá Lobo contesta: Es un cachorro humano. Estaba solo y desprotegido.",
  ]

  // Limpiar el sintetizador de voz cuando el componente se desmonte
  useEffect(() => {
    return () => {
      // Asegurarse de que cualquier audio en reproducción se detenga cuando el componente se desmonte
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Función para reproducir el audio
  const playAudio = () => {
    // Primero, asegurarse de que cualquier audio previo se detenga
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    setIsPlaying(true)

    // Función para reproducir los fragmentos secuencialmente
    const speakNextChunk = (index = 0) => {
      // Si se ha detenido la reproducción, no continuar
      if (!isPlaying && index > 0) return

      if (index >= storyText.length) {
        setIsPlaying(false)
        setHasPlayed(true)
        return
      }

      const chunk = storyText[index].trim()
      if (!chunk) {
        speakNextChunk(index + 1)
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.lang = "es-ES" // Voz en español
      utterance.rate = 0.9 // Velocidad ligeramente más lenta para mayor claridad

      // Ajustar el tono y la velocidad para los diálogos
      if (chunk.includes("pregunta:")) {
        utterance.pitch = 1.2 // Tono ligeramente más alto para preguntas
      } else if (chunk.includes("contesta:")) {
        utterance.pitch = 1.1 // Tono para respuestas
      } else {
        utterance.pitch = 1.0 // Tono normal para narración
      }

      utterance.onend = () => {
        // Solo continuar si todavía estamos en modo reproducción
        if (isPlaying) {
          // Pequeña pausa entre fragmentos
          setTimeout(() => {
            speakNextChunk(index + 1)
          }, 300)
        }
      }

      // Manejar errores en la síntesis de voz
      utterance.onerror = (event) => {
        console.error("Error en la síntesis de voz:", event)
        setIsPlaying(false)
      }

      window.speechSynthesis.speak(utterance)
    }

    // Iniciar la reproducción secuencial
    speakNextChunk()
  }

  // Función para detener el audio - mejorada
  const stopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }

  // Función para saltar el audio y continuar
  const handleSkipAudio = () => {
    // Asegurarse de detener cualquier audio en reproducción
    stopAudio()
    // Marcar como reproducido para cambiar el texto del botón
    setHasPlayed(true)
    // Continuar a la siguiente actividad
    onComplete()
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
      {/* Header con título y subtítulo */}
      <div className="mb-6">
        <h1 className="text-blue-500 font-medium text-lg">Lección 1. Escucho y hablo</h1>
        <h2 className="text-gray-600 text-md mt-1">El libro de la selva: Capítulo 1</h2>
      </div>

      {/* Contenido principal con imagen */}
      <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <p className="text-lg mb-2">Escucha atentamente la historia de Mowgli.</p>
          <p className="text-gray-600">Haz clic en el botón para reproducir el audio.</p>
        </div>

        {/* Imagen de Mowgli bebé */}
        <div className="relative mb-8 w-64 h-64 rounded-lg overflow-hidden">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mowgli_bebe_solo-GMoPqIutR6QEclbTOuPxH3lQ4MDqTp.png"
            alt="Mowgli bebé en la selva"
            className="w-full h-full object-cover"
          />

          {/* Indicador de audio activo (ondas de sonido animadas) */}
          {isPlaying && (
            <div className="absolute bottom-3 right-3 bg-white bg-opacity-70 rounded-full p-2 flex items-center space-x-1">
              <span className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
              <span
                className="w-1 h-5 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1 h-3 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "300ms" }}
              ></span>
              <span
                className="w-1 h-4 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "450ms" }}
              ></span>
            </div>
          )}
        </div>

        {/* Botón de audio con icono */}
        {isPlaying ? (
          <button
            onClick={stopAudio}
            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-4 transition-colors"
          >
            <PauseIcon size={24} />
            <span className="text-lg font-medium">Detener</span>
          </button>
        ) : (
          <button
            onClick={playAudio}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 transition-colors"
          >
            <AudioIcon size={24} />
            <span className="text-lg font-medium">Audio</span>
          </button>
        )}

        {/* Botón para continuar - ahora usa handleSkipAudio */}
        <button
          onClick={handleSkipAudio}
          className={`mt-8 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors ${
            hasPlayed ? "animate-pulse" : ""
          }`}
        >
          {hasPlayed ? "Continuar" : "Saltar audio"}
        </button>
      </div>
    </div>
  )
}
