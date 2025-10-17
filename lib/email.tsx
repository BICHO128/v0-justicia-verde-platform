import nodemailer from "nodemailer"

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Send email notification
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Justicia Verde" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })
    console.log("[v0] Email sent successfully to:", to)
    return true
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return false
  }
}

// Send denuncia status update notification
export async function sendDenunciaStatusNotification(
  userEmail: string,
  userName: string,
  denunciaId: number,
  denunciaTitulo: string,
  newEstado: string,
): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const denunciaUrl = `${appUrl}/denuncias/${denunciaId}`

  const estadoMessages: Record<string, { title: string; message: string; color: string }> = {
    "en revisión": {
      title: "Tu denuncia está siendo revisada",
      message: "Nuestro equipo ha comenzado a revisar tu denuncia. Te mantendremos informado sobre el progreso.",
      color: "#2196f3",
    },
    aceptada: {
      title: "Tu denuncia ha sido aceptada",
      message:
        "Tu denuncia ha sido validada y aceptada. Estamos trabajando en coordinar las acciones necesarias con las autoridades competentes.",
      color: "#4caf50",
    },
    rechazada: {
      title: "Actualización sobre tu denuncia",
      message:
        "Después de revisar tu denuncia, no pudimos proceder con ella. Por favor revisa los comentarios de seguimiento para más detalles.",
      color: "#f44336",
    },
    resuelta: {
      title: "Tu denuncia ha sido resuelta",
      message:
        "¡Buenas noticias! Tu denuncia ha sido resuelta exitosamente. Gracias por tu contribución a la protección del medio ambiente.",
      color: "#4caf50",
    },
  }

  const statusInfo = estadoMessages[newEstado] || {
    title: "Actualización de tu denuncia",
    message: "El estado de tu denuncia ha sido actualizado.",
    color: "#2e7d32",
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Actualización de Denuncia - Justicia Verde</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #2e7d32; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🌿 Justicia Verde</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #212121; margin: 0 0 10px 0; font-size: 20px;">Hola ${userName},</h2>
                    
                    <div style="background-color: ${statusInfo.color}15; border-left: 4px solid ${statusInfo.color}; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <h3 style="color: ${statusInfo.color}; margin: 0 0 10px 0; font-size: 18px;">${statusInfo.title}</h3>
                      <p style="color: #212121; margin: 0; line-height: 1.6;">${statusInfo.message}</p>
                    </div>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
                      <p style="margin: 0 0 10px 0; color: #757575; font-size: 14px;"><strong>Denuncia:</strong></p>
                      <p style="margin: 0 0 10px 0; color: #212121; font-size: 16px;">${denunciaTitulo}</p>
                      <p style="margin: 0 0 10px 0; color: #757575; font-size: 14px;"><strong>ID:</strong> #${denunciaId}</p>
                      <p style="margin: 0; color: #757575; font-size: 14px;"><strong>Nuevo Estado:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${newEstado}</span></p>
                    </div>
                    
                    <p style="color: #212121; line-height: 1.6; margin: 20px 0;">
                      Puedes ver todos los detalles y el seguimiento completo de tu denuncia haciendo clic en el botón de abajo:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${denunciaUrl}" style="background-color: #2e7d32; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Ver Mi Denuncia</a>
                    </div>
                    
                    <p style="color: #757575; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                      Gracias por tu compromiso con la protección del medio ambiente en Colombia.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f5f5f5; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="color: #757575; font-size: 12px; margin: 0 0 10px 0;">
                      © 2025 Justicia Verde. Todos los derechos reservados.
                    </p>
                    <p style="color: #757575; font-size: 12px; margin: 0;">
                      Plataforma ciudadana para la protección ambiental en Colombia
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return sendEmail(userEmail, `${statusInfo.title} - Justicia Verde`, html)
}

// Send new denuncia notification to admins
export async function sendNewDenunciaNotification(
  adminEmail: string,
  denunciaId: number,
  denunciaTitulo: string,
  denunciaDescripcion: string,
): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const denunciaUrl = `${appUrl}/denuncias/${denunciaId}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Denuncia - Justicia Verde</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background-color: #2e7d32; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🌿 Justicia Verde - Admin</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px 30px;">
                    <div style="background-color: #ff980015; border-left: 4px solid #ff9800; padding: 15px; margin: 0 0 20px 0; border-radius: 4px;">
                      <h3 style="color: #ff9800; margin: 0 0 10px 0; font-size: 18px;">⚠️ Nueva Denuncia Pendiente de Revisión</h3>
                      <p style="color: #212121; margin: 0; line-height: 1.6;">Se ha registrado una nueva denuncia ambiental que requiere tu atención.</p>
                    </div>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
                      <p style="margin: 0 0 10px 0; color: #757575; font-size: 14px;"><strong>ID:</strong> #${denunciaId}</p>
                      <p style="margin: 0 0 10px 0; color: #212121; font-size: 16px; font-weight: bold;">${denunciaTitulo}</p>
                      <p style="margin: 0; color: #757575; font-size: 14px; line-height: 1.6;">${denunciaDescripcion.substring(0, 200)}${denunciaDescripcion.length > 200 ? "..." : ""}</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${denunciaUrl}" style="background-color: #2e7d32; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Revisar Denuncia</a>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #f5f5f5; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="color: #757575; font-size: 12px; margin: 0;">
                      © 2025 Justicia Verde - Panel de Administración
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return sendEmail(adminEmail, `Nueva Denuncia #${denunciaId} - Justicia Verde`, html)
}
