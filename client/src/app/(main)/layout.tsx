// import Footer from "@modules/layout/templates/footer"
// import Nav from "@modules/layout/templates/nav"
import Layout from "@modules/layout/templates"

export default function PageLayout({
  
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <> se comenta esta seccion para implementar pruebas
    //   <Nav />
    //   {children}
    //   <Footer />
    // </>
    <>
      <Layout>{children}
      </Layout>
    </>
  )
}
