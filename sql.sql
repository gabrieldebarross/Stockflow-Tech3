-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 10/09/2026 às 01:48
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `stockflow`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dashboard` ()   BEGIN

    SELECT
        COUNT(*) AS total_vendas,
        COALESCE(SUM(total), 0) AS faturamento_total
    FROM vw_vendas;

    SELECT
        COUNT(*) AS total_produtos
    FROM produto;

    SELECT
        COUNT(*) AS produtos_estoque_critico
    FROM produto
    WHERE estoque <= estoque_minimo;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dashboard_vendas` ()   BEGIN

    SELECT
        id_venda,
        data_venda,
        id_produto,
        produto,
        categoria,
        quantidade,
        valor_unitario,
        total
    FROM vw_vendas
    ORDER BY data_venda DESC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_listar_vendas` (IN `p_busca` VARCHAR(100), IN `p_pagina` INT, IN `p_limite` INT)   BEGIN

    DECLARE v_offset INT;

    SET v_offset = (p_pagina - 1) * p_limite;

    SELECT
        id_venda,
        data_venda,
        produto,
        categoria,
        quantidade,
        valor_unitario,
        total
    FROM vw_vendas
    WHERE p_busca = ''
       OR produto LIKE CONCAT('%', p_busca, '%')
       OR categoria LIKE CONCAT('%', p_busca, '%')
    ORDER BY data_venda DESC
    LIMIT v_offset, p_limite;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_produtos_estoque_critico` ()   BEGIN

    SELECT
        p.id_produto,
        p.nome,
        c.nome AS categoria,
        p.estoque,
        p.estoque_minimo
    FROM produto p
    INNER JOIN categoria c
        ON p.id_categoria = c.id_categoria
    WHERE p.estoque <= p.estoque_minimo
    ORDER BY p.estoque ASC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ranking_produtos` ()   BEGIN

    WITH ranking AS (
        SELECT
            produto,
            SUM(quantidade) AS quantidade_vendida,
            SUM(total) AS faturamento
        FROM vw_vendas
        GROUP BY produto
    )

    SELECT
        produto,
        quantidade_vendida,
        faturamento
    FROM ranking
    ORDER BY quantidade_vendida DESC;

END$$

--
-- Funções
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_calcular_total` (`quantidade` INT, `valor_unitario` DECIMAL(10,2)) RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN
    RETURN quantidade * valor_unitario;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nome`, `descricao`) VALUES
(1, 'Informática', 'Produtos de informática e tecnologia'),
(2, 'Periféricos', 'Teclados, mouses e acessórios'),
(3, 'Monitores', 'Monitores e telas');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id_produto` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `estoque` int(11) NOT NULL DEFAULT 0,
  `estoque_minimo` int(11) NOT NULL DEFAULT 5,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id_produto`, `nome`, `preco`, `estoque`, `estoque_minimo`, `id_categoria`) VALUES
(1, 'Notebook Lenovo', 3500.00, 0, 3, 1),
(2, 'Mouse Logitech', 120.00, 23, 5, 2),
(3, 'Teclado Mecânico', 250.00, 16, 3, 2),
(4, 'Monitor LG 24\"', 899.90, 5, 5, 3),
(5, 'Webcam Full HD', 180.00, 4, 4, 2),
(8, 'Mouse Gamer StockFlow', 200.00, 0, 5, 3);

--
-- Acionadores `produto`
--
DELIMITER $$
CREATE TRIGGER `trg_produto_estoque_positivo` BEFORE UPDATE ON `produto` FOR EACH ROW BEGIN
    IF NEW.estoque < 0 THEN
        SET NEW.estoque = 0;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `venda`
--

CREATE TABLE `venda` (
  `id_venda` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `data_venda` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `venda`
--

INSERT INTO `venda` (`id_venda`, `id_produto`, `quantidade`, `valor_unitario`, `data_venda`) VALUES
(10, 5, 1, 180.00, '2026-09-02 18:55:22'),
(11, 1, 2, 3500.00, '2026-09-02 18:58:32'),
(12, 5, 1, 180.00, '2026-09-09 19:15:02'),
(13, 2, 1, 120.00, '2026-09-09 19:19:37'),
(14, 8, 5, 200.00, '2026-09-09 19:21:33'),
(15, 2, 10, 120.00, '2026-09-09 19:22:35'),
(16, 4, 1, 800.00, '2026-09-09 19:22:45');

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_vendas`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_vendas` (
`id_venda` int(11)
,`data_venda` datetime
,`id_produto` int(11)
,`produto` varchar(100)
,`id_categoria` int(11)
,`categoria` varchar(100)
,`quantidade` int(11)
,`valor_unitario` decimal(10,2)
,`total` decimal(20,2)
);

-- --------------------------------------------------------

--
-- Estrutura para view `vw_vendas`
--
DROP TABLE IF EXISTS `vw_vendas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_vendas`  AS SELECT `v`.`id_venda` AS `id_venda`, `v`.`data_venda` AS `data_venda`, `p`.`id_produto` AS `id_produto`, `p`.`nome` AS `produto`, `c`.`id_categoria` AS `id_categoria`, `c`.`nome` AS `categoria`, `v`.`quantidade` AS `quantidade`, `v`.`valor_unitario` AS `valor_unitario`, `v`.`quantidade`* `v`.`valor_unitario` AS `total` FROM ((`venda` `v` join `produto` `p` on(`v`.`id_produto` = `p`.`id_produto`)) join `categoria` `c` on(`p`.`id_categoria` = `c`.`id_categoria`)) ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id_produto`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Índices de tabela `venda`
--
ALTER TABLE `venda`
  ADD PRIMARY KEY (`id_venda`),
  ADD KEY `id_produto` (`id_produto`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `venda`
--
ALTER TABLE `venda`
  MODIFY `id_venda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `produto`
--
ALTER TABLE `produto`
  ADD CONSTRAINT `produto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Restrições para tabelas `venda`
--
ALTER TABLE `venda`
  ADD CONSTRAINT `venda_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
