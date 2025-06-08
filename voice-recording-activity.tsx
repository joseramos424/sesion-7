"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MicIcon, MonitorStopIcon as StopIcon, PlayIcon, CheckIcon, InfoIcon, XIcon } from "lucide-react"

export default function VoiceRecordingActivity({
  onComplete,
}: {
  onComplete: (recordings: { [key: number]: string }) => void
}) {
  // Preguntas sobre la historia
  const questions = [
    { id: 1, text: "¿Dónde ocurre el cuento?" },
    { id: 2, text: "¿Cómo se llama el niño del cuento?" },
    { id: 3, text: "¿Dónde encontró Papá Lobo a Mowgli?" },
    { id: 4, text: "¿Dónde estaba Mamá Loba?" },
  ]

  // Estado para almacenar las grabaciones
  const [recordings, setRecordings] = useState<{ [key: number]: string }>({})

  // Estado para controlar qué pregunta se está grabando actualmente
  const [recordingId, setRecordingId] = useState<number | null>(null)

  // Estado para controlar qué pregunta se está reproduciendo actualmente
  const [playingId, setPlayingId] = useState<number | null>(null)

  // Estado para controlar la ventana emergente de instrucciones
  const [showInstructions, setShowInstructions] = useState(false)

  // Referencias para el MediaRecorder y el audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioElementsRef = useRef<{ [key: number]: HTMLAudioElement | null }>({})

  // Referencia para el modal de instrucciones (para accesibilidad)
  const instructionsModalRef = useRef<HTMLDivElement>(null)

  // Función para abrir el modal de instrucciones
  const openInstructions = () => {
    setShowInstructions(true)
    // Enfoque en el modal para accesibilidad
    setTimeout(() => {
      if (instructionsModalRef.current) {
        instructionsModalRef.current.focus()
      }
    }, 100)
  }

  // Función para cerrar el modal de instrucciones
  const closeInstructions = () => {
    setShowInstructions(false)
  }

  // Manejador de teclas para el modal (cerrar con Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeInstructions()
    }
  }

  // Función para iniciar la grabación
  const startRecording = async (questionId: number) => {
    try {
      // Solicitar permisos para el micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Crear un nuevo MediaRecorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      // Configurar el evento para recopilar datos
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Configurar el evento para cuando se detenga la grabación
      mediaRecorder.onstop = () => {
        // Crear un blob con los datos de audio
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        // Crear una URL para el blob
        const audioUrl = URL.createObjectURL(audioBlob)

        // Guardar la URL en el estado
        setRecordings((prev) => ({
          ...prev,
          [questionId]: audioUrl,
        }))

        // Detener todas las pistas del stream
        stream.getTracks().forEach((track) => track.stop())

        // Resetear el estado de grabación
        setRecordingId(null)
      }

      // Iniciar la grabación
      mediaRecorder.start()
      setRecordingId(questionId)
    } catch (error) {
      console.error("Error al acceder al micrófono:", error)
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.")
    }
  }

  // Función para detener la grabación
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }

  // Función para reproducir una grabación
  const playRecording = (questionId: number) => {
    // Si hay una reproducción en curso, detenerla
    if (playingId !== null && audioElementsRef.current[playingId]) {
      audioElementsRef.current[playingId]!.pause()
      audioElementsRef.current[playingId]!.currentTime = 0
    }

    // Reproducir la nueva grabación
    if (audioElementsRef.current[questionId]) {
      setPlayingId(questionId)
      audioElementsRef.current[questionId]!.play()

      // Cuando termine la reproducción, resetear el estado
      audioElementsRef.current[questionId]!.onended = () => {
        setPlayingId(null)
      }
    }
  }

  // Verificar si todas las preguntas tienen respuestas grabadas
  const allQuestionsAnswered = questions.every((q) => recordings[q.id])

  // Función para manejar el clic en el botón continuar
  const handleContinue = () => {
    onComplete(recordings)
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
        {/* Encabezado con orden de trabajo e instrucciones */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-xl font-medium mb-2 md:mb-0">Graba las respuestas a estas preguntas</h3>
          <button
            onClick={openInstructions}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Ver instrucciones de accesibilidad"
          >
            <InfoIcon size={18} />
            <span>Instrucciones</span>
          </button>
        </div>

        {/* Lista de preguntas */}
        <div className="space-y-6 mb-8">
          {questions.map((question) => (
            <div
              key={question.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 mb-3 md:mb-0">
                <p className="font-medium">
                  {question.id}. {question.text}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Botón de grabación */}
                {recordingId === question.id ? (
                  <button
                    onClick={stopRecording}
                    className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10"
                    aria-label="Detener grabación"
                  >
                    <StopIcon size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => startRecording(question.id)}
                    disabled={recordingId !== null}
                    className={`flex items-center justify-center ${
                      recordings[question.id] ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                    } text-white rounded-full w-10 h-10 ${recordingId !== null ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={recordings[question.id] ? "Volver a grabar respuesta" : "Grabar respuesta"}
                  >
                    {recordings[question.id] ? <CheckIcon size={18} /> : <MicIcon size={18} />}
                  </button>
                )}

                {/* Botón de reproducción (solo visible si hay una grabación) */}
                {recordings[question.id] && (
                  <button
                    onClick={() => playRecording(question.id)}
                    disabled={recordingId !== null}
                    className={`flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white rounded-full w-10 h-10 ${
                      playingId === question.id ? "animate-pulse" : ""
                    } ${recordingId !== null ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label="Reproducir respuesta grabada"
                  >
                    <PlayIcon size={18} />
                  </button>
                )}

                {/* Elemento de audio oculto para reproducción */}
                {recordings[question.id] && (
                  <audio
                    ref={(el) => {
                      audioElementsRef.current[question.id] = el
                    }}
                    src={recordings[question.id]}
                    style={{ display: "none" }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botón para continuar */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className={`px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors ${
              allQuestionsAnswered ? "animate-pulse" : ""
            }`}
          >
            {allQuestionsAnswered ? "Continuar" : "Saltar actividad"}
          </button>
        </div>
      </div>

      {/* Modal de instrucciones */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={instructionsModalRef}
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 mx-4"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-labelledby="instructions-title"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 id="instructions-title" className="text-xl font-bold">
                Instrucciones de accesibilidad
              </h2>
              <button
                onClick={closeInstructions}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cerrar instrucciones"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <section>
                <h3 className="font-medium text-lg mb-2">Cómo grabar tus respuestas</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Haz clic en el botón con el icono de micrófono <MicIcon size={14} className="inline" /> junto a cada
                    pregunta.
                  </li>
                  <li>Cuando el botón se vuelva rojo, comienza a hablar para grabar tu respuesta.</li>
                  <li>
                    Haz clic en el botón de detener <StopIcon size={14} className="inline" /> cuando hayas terminado.
                  </li>
                  <li>
                    Si la grabación fue exitosa, verás un icono de verificación{" "}
                    <CheckIcon size={14} className="inline" />.
                  </li>
                </ol>
              </section>

              <section>
                <h3 className="font-medium text-lg mb-2">Cómo escuchar tus grabaciones</h3>
                <p>
                  Después de grabar una respuesta, aparecerá un botón de reproducción{" "}
                  <PlayIcon size={14} className="inline" />. Haz clic en él para escuchar tu grabación.
                </p>
              </section>

              <section>
                <h3 className="font-medium text-lg mb-2">Permisos del micrófono</h3>
                <p>
                  Esta actividad requiere acceso a tu micrófono. Si ves un mensaje solicitando permiso, debes hacer clic
                  en "Permitir" para poder grabar tus respuestas.
                </p>
              </section>

              <section>
                <h3 className="font-medium text-lg mb-2">Navegación con teclado</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Usa la tecla <kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> para moverte entre los
                    elementos interactivos.
                  </li>
                  <li>
                    Usa <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> o{" "}
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Espacio</kbd> para activar botones.
                  </li>
                  <li>
                    Puedes cerrar esta ventana con la tecla <kbd className="px-2 py-1 bg-gray-100 rounded">Escape</kbd>.
                  </li>
                </ul>
              </section>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={closeInstructions}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
