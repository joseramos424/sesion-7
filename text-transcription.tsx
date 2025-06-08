"use client"

import { useState, useEffect, useRef } from "react"
import { VolumeIcon as VolumeUp, PauseIcon } from "lucide-react"

export default function TextTranscription({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  // Referencia para controlar si debemos continuar la reproducción
  const shouldContinueRef = useRef(true)

  // Texto completo de la historia de Mowgli
  const storyText = [
    "Mowgli era un niño pequeño que vivía en una selva verde, con árboles muy altos.",
    "Mowgli no era un niño común.",
    "Una familia de lobos cuidó de Mowgli desde que era un bebé.",
    "Todo comenzó cuando Papá Lobo encontró al pequeño Mowgli cerca de un río.",
    "Mowgli estaba solo.",
    "El bebé sonrió al ver al lobo.",
    "Papá Lobo decidió llevarlo a su cueva.",
    "Allí Mamá Loba cuidaba de sus propios cachorros.",
    "Mamá Loba pregunta: ¿Qué traes ahí papá Lobo?",
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
    shouldContinueRef.current = true

    // Función para reproducir los fragmentos secuencialmente
    const speakNextChunk = (index = 0) => {
      // Si hemos llegado al final o se ha cancelado la reproducción
      if (index >= storyText.length || !shouldContinueRef.current) {
        setIsPlaying(false)
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

      // Cuando termine de hablar, pasar al siguiente fragmento
      utterance.onend = () => {
        // Pequeña pausa entre fragmentos
        setTimeout(() => {
          if (shouldContinueRef.current) {
            speakNextChunk(index + 1)
          }
        }, 300)
      }

      // Manejar errores en la síntesis de voz
      utterance.onerror = (event) => {
        console.error("Error en la síntesis de voz:", event)
        setIsPlaying(false)
        shouldContinueRef.current = false
      }

      window.speechSynthesis.speak(utterance)
    }

    // Iniciar la reproducción secuencial
    speakNextChunk()
  }

  // Función para detener el audio
  const stopAudio = () => {
    shouldContinueRef.current = false
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }

  // Función para formatear el texto con estilos para diálogos
  const formatStoryText = () => {
    return storyText.map((line, index) => {
      if (!line.trim()) return null

      // Aplicar estilos especiales a los diálogos
      if (line.includes("pregunta:") || line.includes("contesta:")) {
        const [speaker, dialog] = line.split(":")
        return (
          <p key={index} className="mb-4 text-lg">
            <span className="font-medium">{speaker}:</span>
            <span className="italic">{dialog}</span>
          </p>
        )
      }

      return (
        <p key={index} className="mb-4 text-lg">
          {line.trim()}
        </p>
      )
    })
  }

  // Función para resaltar el texto que se está reproduciendo
  const highlightCurrentText = (index) => {
    // Implementación futura para resaltar el texto actual
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
      {/* Header con título y subtítulo */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-blue-500 font-medium text-lg">Lección 1. Escucho y hablo</h1>
          <h2 className="text-gray-600 text-md mt-1">El libro de la selva: Capítulo 1</h2>
        </div>

        {/* Botón de audio en la esquina superior derecha */}
        {isPlaying ? (
          <button
            onClick={stopAudio}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 transition-colors"
          >
            <PauseIcon size={18} />
            <span className="text-sm font-medium">Detener</span>
          </button>
        ) : (
          <button
            onClick={playAudio}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 transition-colors"
          >
            <VolumeUp size={18} />
            <span className="text-sm font-medium">Audio</span>
          </button>
        )}
      </div>

      {/* Contenido principal con la transcripción */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-4 text-center">Transcripción del cuento</h3>
        </div>

        {/* Texto de la historia */}
        <div className="prose max-w-none">{formatStoryText()}</div>

        {/* Botón para continuar */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
