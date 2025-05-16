package spring.boot.api.todo.list.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.boot.api.todo.list.Dto.TarefaDto;
import spring.boot.api.todo.list.model.Tarefa;
import spring.boot.api.todo.list.repository.TarefaRepository;

import java.util.List;
import java.util.Optional;

@RestController
public class TarefaController {

    @Autowired
    TarefaRepository repository;

    @PostMapping("/tarefas")
    public ResponseEntity<Tarefa> criar(@RequestBody TarefaDto dto) {
        Tarefa tarefa = new Tarefa();
        BeanUtils.copyProperties(dto, tarefa);
        return ResponseEntity.ok(repository.save(tarefa));
    }

    @GetMapping("/tarefas")
    public ResponseEntity<List<Tarefa>> listar() {
        return ResponseEntity.status(HttpStatus.OK).body(repository.findAll());
    }

    @GetMapping("/tarefas/{id}")
    public ResponseEntity<Object> listarId (@PathVariable(value = "id") Long id){
        Optional<Tarefa> tarefa = repository.findById(id);
        if (tarefa.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tarefa de id"+id+" não foi encontrado");
        }
        return ResponseEntity.status(HttpStatus.OK).body(tarefa.get());
    }

    @PutMapping("/tarefas/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable Long id, @RequestBody TarefaDto dto) {
        Optional<Tarefa> tarefaOptional = repository.findById(id);
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tarefa de id"+id+" não foi encontrado");
        }
        Tarefa tarefa = tarefaOptional.get();
        BeanUtils.copyProperties(dto, tarefa);
        Tarefa atualizada = repository.save(tarefa);

        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/tarefas/{id}")
    public ResponseEntity<Object> deletar(@PathVariable(value = "id") Long id) {
        Optional<Tarefa> tarefa = repository.findById(id);
        if (tarefa.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tarefa de id"+id+" não foi encontrado");
        }
        repository.delete(tarefa.get());
        return ResponseEntity.status(HttpStatus.OK).body("Tarefa id" +id+ "removido com sucesso!");
    }
}