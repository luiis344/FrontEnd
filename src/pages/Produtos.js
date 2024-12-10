import React, { useState, useEffect } from 'react';
import { fetchProdutos, postProduto, deleteProduto } from '../services/api';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoAtual, setProdutoAtual] = useState({
    nome: '',
    preco: ''
  });
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const data = await fetchProdutos();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      alert('Não foi possível carregar os produtos');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoAtual(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postProduto(produtoAtual);
      alert(modoEdicao ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
      carregarProdutos();
      limparFormulario();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto');
    }
  };

  const editarProduto = (produto) => {
    setProdutoAtual(produto);
    setModoEdicao(true);
  };

  const deletarProduto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduto(id);
        alert('Produto removido com sucesso!');
        carregarProdutos();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar produto');
      }
    }
  };

  const limparFormulario = () => {
    setProdutoAtual({
      nome: '',
      preco: ''
    });
    setModoEdicao(false);
  };

  return (
    <div className="container">
      <h1>Cadastro de Produtos</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={produtoAtual.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Preço</label>
          <input
            type="number"
            name="preco"
            value={produtoAtual.preco}
            onChange={handleChange}
            required
          />
       </div>
<div>
  <button type="submit" className={modoEdicao ? 'btn-atualizar' : 'btn-cadastrar'}>
    {modoEdicao ? 'Atualizar' : 'Cadastrar'}
  </button>
  {modoEdicao && (
    <button type="button" onClick={limparFormulario} className="btn-cancelar">
      Cancelar
    </button>
  )}
</div>

      </form>

      <table id="produtos-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Preço</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {produtos.map((produto) => (
      <tr key={produto.id}>
        <td>{produto.id}</td>
        <td>{produto.nome}</td>
        <td>{produto.preco}</td>
        <td>
          <button className="btn-editar" onClick={() => editarProduto(produto)}>
            Editar
          </button>
          <button className="btn-excluir" onClick={() => deletarProduto(produto.id)}>
            Excluir
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

export default Produtos;
