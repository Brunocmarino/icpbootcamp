import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { to_do_backend } from '../../declarations/backend';
import { AuthClient } from "@dfinity/auth-client";


function Tarefas() {
    const [tarefas, setTarefas] = useState([]);
    const [totalEmAndamento, setTotalEmAndamento] = useState(0);
    const [totalConcluidas, setTotalConcluidas] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
      // Verificar se o usuário está autenticado
      const checkAuth = async () => {
        // Checar se o usuário está autenticado
        const isAuthenticated = localStorage.getItem('isAuthenticated');

        if (!isAuthenticated || isAuthenticated !== 'true') {
          // Se não estiver autenticado, redirecionar para a página inicial
          navigate('/');
          return;
        }

        // Se estiver autenticado, carregar os dados
        consultarTarefas();
        totalTarefasEmAndamento();
        totalTarefasConcluidas();
      };

      checkAuth();
    }, [navigate]);

    async function consultarTarefas(){
      setTarefas(await to_do_backend.getTarefas());
    }

    // Função para obter o total de tarefas em andamento
    async function totalTarefasEmAndamento() {
      const total = parseInt(await to_do_backend.totalTarefasEmAndamento());
      setTotalEmAndamento(total);
    }

    // Função para obter o total de tarefas concluídas
    async function totalTarefasConcluidas() {
      const total = parseInt(await to_do_backend.totalTarefasConcluidas());
      setTotalConcluidas(total);
    }

    // Função para fazer logout
    async function handleLogout() {
      try {
        const authClient = await AuthClient.create();
        await authClient.logout();
        localStorage.removeItem('isAuthenticated');
        navigate('/');
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    }

    async function handleSubmit(event) {
      event.preventDefault();

      const idTarefa = event.target.elements.idTarefa.value;
      const categoria = event.target.elements.categoria.value;
      const descricao = event.target.elements.descricao.value;
      const urgente = ((event.target.elements.urgente.value === "false") ? false : true);

      if (idTarefa === null || idTarefa === "") {
        await to_do_backend.addTarefa(descricao, categoria, false, false);
      } else {
        await to_do_backend.alterarTarefa(parseInt(idTarefa), categoria, descricao, urgente, false);
      }

      // Atualiza os dados após a inclusão/alteração
      consultarTarefas();
      totalTarefasEmAndamento();

      event.target.elements.idTarefa.value = "";
      event.target.elements.categoria.value = "";
      event.target.elements.descricao.value = "";
      event.target.elements.urgente.value = "";
    }

    async function excluir(id) {
      await to_do_backend.excluirTarefa(parseInt(id));

      // Atualiza os dados após a exclusão
      consultarTarefas();
      totalTarefasEmAndamento();
    }

    async function alterar(id, categoria, descricao, urgente, concluida) {
      await to_do_backend.alterarTarefa(parseInt(id), categoria, descricao, urgente, concluida);

      // Atualiza os dados após a alteração
      consultarTarefas();

      // Se houve mudança no status de conclusão, atualiza ambos os contadores
      if (concluida) {
        totalTarefasConcluidas();
        totalTarefasEmAndamento();
      } else {
        totalTarefasEmAndamento();
      }
    }

    async function editar(id, categoria, descricao, urgente) {
      document.getElementById('formTarefas').elements['idTarefa'].value = id;
      document.getElementById('formTarefas').elements['categoria'].value = categoria;
      document.getElementById('formTarefas').elements['descricao'].value = descricao;
      document.getElementById('formTarefas').elements['urgente'].value = urgente;
    }

    return (
      <main className="mt-[30px] mx-[30px]">
        {/* Botão de Logout */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Sair
          </button>
        </div>

        <form id="formTarefas" className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full max-w-6xl mx-auto mb-6" onSubmit={handleSubmit}>
            <div className="w-full md:w-[20%]">
                <select
                id="categoria"
                className="block w-full px-4 py-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                <option disabled selected>Categoria</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Saúde">Saúde</option>
                <option value="Casa">Casa</option>
                <option value="Lazer">Lazer</option>
                <option value="Estudo">Estudo</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Compras">Compras</option>
                <option value="Projetos">Projetos</option>
                <option value="Outros">Outros</option>
                </select>
            </div>

            <div className="w-full md:w-[80%] relative">
                <div className="flex items-center">
                <input
                    type="text"
                    id="descricao"
                    className="block w-full p-4 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Adicione uma tarefa"
                    required
                />
                <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Adicionar
                </button>
                </div>
            </div>
            <input type="hidden" name="idTarefa" />
            <input type="hidden" name="urgente" />
            </form>

        <br/>

        <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Tarefas em andamento</h5>
          </div>

          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {tarefas.filter((ta) => !ta.concluida).map((ta) => (
                <li key={ta.id} className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <a onClick={() => { alterar(ta.id, ta.categoria, ta.descricao, !ta.urgente, ta.concluida) }} className="cursor-pointer">
                        {!ta.urgente && (
                          <svg className="w-6 h-6 ms-2 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                          </svg>
                        )}
                        {ta.urgente && (
                          <svg className="w-6 h-6 ms-2 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                          </svg>
                        )}
                      </a>
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {ta.categoria}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {ta.descricao}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <span className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        <a onClick={() => { alterar(ta.id, ta.categoria, ta.descricao, ta.urgente, !ta.concluida) }} className="cursor-pointer">
                          <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                          </svg>
                        </a>
                      </span>

                      <span className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        <a onClick={() => { editar(ta.id, ta.categoria, ta.descricao, ta.urgente) }} className="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" />
                          </svg>
                        </a>
                      </span>

                      <span className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        <a onClick={() => { excluir(ta.id) }} className="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                          </svg>
                        </a>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Totalizador de tarefas em andamento */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">TOTAL</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{totalEmAndamento}</span>
              </div>
            </div>
          </div>
        </div>

        <br/>

        <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Tarefas concluídas</h5>
          </div>

          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {tarefas.filter((ta) => ta.concluida).map((ta) => (
                <li key={ta.id} className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      {!ta.urgente && (
                        <svg className="w-6 h-6 ms-2 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                        </svg>
                      )}
                      {ta.urgente && (
                        <svg className="w-6 h-6 ms-2 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {ta.categoria}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {ta.descricao}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Totalizador de tarefas concluídas */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">TOTAL</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{totalConcluidas}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  export default Tarefas;
