export type AppletType = 'action' | 'reaction'

export interface Applet {
  id: string
  type: AppletType
  name: string
}

export interface LogMessage {
  applet: Applet
  timestamp: string
  success: boolean
}

export const simulateAppletExecution = (applet: Applet): boolean => {
  return Math.random() > 0.2
}

