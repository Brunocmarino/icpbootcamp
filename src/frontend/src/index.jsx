import { Link, useNavigate } from 'react-router-dom';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from '../../declarations/backend';

function Index() {
    const navigate = useNavigate();

    // Função de autenticação que será chamada ao clicar no botão ENTRAR
    async function handleLogin() {
      try {
        // Criar o authClient
        let authClient = await AuthClient.create();

        // Inicia o processo de login e aguarda até que ele termine
        await authClient.login({
          // Redireciona para o provedor de identidade da ICP (Internet Identity)
          identityProvider: "https://identity.ic0.app/#authorize",
          onSuccess: async () => {
            // Caso entrar neste bloco significa que a autenticação ocorreu com sucesso!
            const identity = authClient.getIdentity();
            console.log("Usuário autenticado com sucesso!");
            console.log("Principal do usuário:", identity.getPrincipal().toText());

            // Configurar o HttpAgent com a identidade do usuário
            const agent = new HttpAgent({identity});

            // Criar o actor autenticado para backend
            const authenticatedActor = createActor(process.env.CANISTER_ID_TO_DO_BACKEND, {
              agent,
            });

            // Salvar o actor autenticado no localStorage para ser usado em outras páginas
            localStorage.setItem('isAuthenticated', 'true');

            // Navegar para a página de tarefas
            navigate('/tarefas/');
          },

          // Configuração da janela de autenticação
          windowOpenerFeatures: `
            left=${window.screen.width / 2 - 525 / 2},
            top=${window.screen.height / 2 - 705 / 2},
            toolbar=0,location=0,menubar=0,width=525,height=705
          `,
        });
      } catch (error) {
        console.error("Erro durante a autenticação:", error);
      }
    }

    return (
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">TO-DO</h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Controle suas tarefas 100% onchain na ICP!</p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
            {/* Trocamos o Link por um botão para usar a função de autenticação */}
            <button
              onClick={handleLogin}
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              ENTRAR
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
    );
  }

export default Index;
