import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Shield, Users, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-light to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Justicia Verde</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">Protege el Medio Ambiente de Colombia</h1>
        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto text-pretty">
          Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales mediante tecnología,
          participación ciudadana y apoyo legal.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground">
              Crear Denuncia
            </Button>
          </Link>
          <Link href="/denuncias">
            <Button size="lg" variant="outline">
              Ver Denuncias
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Denuncias Seguras</h3>
            <p className="text-muted-foreground">
              Reporta delitos ambientales de forma oficial o anónima con total seguridad y confidencialidad.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Participación Ciudadana</h3>
            <p className="text-muted-foreground">
              Únete a una comunidad comprometida con la protección del medio ambiente colombiano.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Seguimiento en Tiempo Real</h3>
            <p className="text-muted-foreground">
              Rastrea el estado de tu denuncia desde la revisión hasta la resolución del caso.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Presenciaste un Delito Ambiental?</h2>
          <p className="text-lg mb-8 opacity-90">
            Tu voz es importante. Ayúdanos a proteger nuestros recursos naturales.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Hacer una Denuncia Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Justicia Verde. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">Plataforma ciudadana para la protección ambiental en Colombia</p>
        </div>
      </footer>
    </div>
  )
}
