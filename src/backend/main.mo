// Gerenciador de Tarefas em Motoko
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";

actor {
    // Definição da estrutura Type para organizar os dados das tarefas
    type Tarefa = {
        id: Nat;          // Identificador único da tarefa
        categoria: Text;  // Categoria da tarefa   
        descricao: Text;  // Descrição detalhada da tarefa   
        urgente: Bool;    // Indica se a tarefa é urgente (true) ou não (false) 
        concluida: Bool;  // Indica se a tarefa foi concluída (true) ou não (false)   
    };

    // Variável para armazenar o último identificador gerado
    var idTarefa : Nat = 0;

    // Buffer para armazenar as tarefas (inicializado com capacidade de 10 itens)
    var tarefas : Buffer.Buffer<Tarefa> = Buffer.Buffer<Tarefa>(10);

    // Função para adicionar itens ao buffer 'tarefas'
    public func addTarefa(desc: Text, cat: Text, urg: Bool, con: Bool) : async () {
        // Incrementa o identificador para criar um ID único
        idTarefa += 1;
        
        // Cria um novo registro do tipo Tarefa
        let t : Tarefa = {
            id = idTarefa;
            categoria = cat;    
            descricao = desc;                          
            urgente = urg;                   
            concluida = con;                   
        };

        // Adiciona a tarefa ao buffer
        tarefas.add(t);
    };

    // Função para remover itens do buffer 'tarefas'
    public func excluirTarefa(idExcluir: Nat) : async () {
        // Função interna que será usada para filtrar as tarefas
        // Retorna true para todas as tarefas que NÃO correspondem ao ID a ser excluído
        func localizaExcluir(_: Nat, x: Tarefa) : Bool {
          return x.id != idExcluir;
        };

        // Filtra o buffer, mantendo apenas as tarefas que não possuem o ID especificado
        tarefas.filterEntries(localizaExcluir);
    };

    // Função para alterar itens do buffer 'tarefas'
    public func alterarTarefa(idTar: Nat, 
                             cat: Text,
                             desc: Text,                             
                             urg: Bool, 
                             con: Bool) : async () {
        
        // Cria um registro com as novas informações da tarefa
        let t : Tarefa = {
            id = idTar;
            categoria = cat;    
            descricao = desc;                        
            urgente = urg;                      
            concluida = con;
        };

        // Função interna para encontrar a tarefa com o mesmo ID
        func localizaIndex(x: Tarefa, y: Tarefa) : Bool {
            return x.id == y.id;
        };

        // Procura o índice da tarefa no buffer
        let index : ?Nat = Buffer.indexOf(t, tarefas, localizaIndex);

        // Verifica se um índice válido foi encontrado
        switch(index) {
            case(null) {
                // Não foi localizado um index (a tarefa não existe)
            };
            case(?i) {
                // Atualiza a tarefa no índice encontrado
                tarefas.put(i, t);
            };
        };
    };

    // Função para retornar todos os itens do buffer 'tarefas'
    public func getTarefas() : async [Tarefa] {
        // Converte o buffer para um array e retorna
        return Buffer.toArray(tarefas);
    };

    // contar o total de tarefas em andamento
    public query func totalTarefasEmAndamento() : async Nat {
      var total : Nat = 0;
      
      // Percorre todas as tarefas no buffer e conta as que não estão concluídas
      for (tarefa in tarefas.vals()) {
        if (tarefa.concluida == false) {
          total += 1;
        };
      };
      
      return total;
    };

    // contar o total de tarefas concluídas
    public query func totalTarefasConcluidas() : async Nat {
      var total : Nat = 0;
      
      // Percorre todas as tarefas no buffer e conta as que estão concluídas
      for (tarefa in tarefas.vals()) {
        if (tarefa.concluida == true) {
          total += 1;
        };
      };
      
      return total;
    };
};