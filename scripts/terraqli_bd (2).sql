-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 31, 2016 at 10:10 AM
-- Server version: 5.6.25
-- PHP Version: 5.6.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `terraqli_bd`
--
CREATE DATABASE IF NOT EXISTS `terraqli_bd` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `terraqli_bd`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `prc_associados_ativacao`$$
CREATE DEFINER=`terraqli`@`localhost` PROCEDURE `prc_associados_ativacao`(IN `p_email` VARCHAR(50))
BEGIN
  UPDATE associados
     SET Ativo = 1
   WHERE Email = p_email
       ;
END$$

DROP PROCEDURE IF EXISTS `prc_associados_del`$$
CREATE DEFINER=`terraqli`@`localhost` PROCEDURE `prc_associados_del`(IN `p_associado_id` INT)
    COMMENT 'Inativação de Usuário'
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN 
    SELECT 'Erro 02: Ocorreu um erro inexperado. Avise a equipe do Terra do Futebol' AS Msg1;
  END;
update associados set Ativo=0 where associado_id = p_associado_id;
END$$

DROP PROCEDURE IF EXISTS `prc_associados_ins`$$
CREATE DEFINER=`terraqli`@`localhost` PROCEDURE `prc_associados_ins`(IN `p_Email` VARCHAR(50), IN `p_Dependente` INT, IN `p_Responsavel` VARCHAR(50), IN `p_LoginExterno` INT, IN `p_NomeCompleto` VARCHAR(100), IN `p_Senha` VARCHAR(32), IN `p_DtNascimento` DATE, IN `p_Sexo` INT)
    COMMENT 'Procedure de Inclusão de Associados'
BEGIN
DECLARE w_senha varchar(32);
DECLARE w_Responsavel varchar(32);
DECLARE EXIT HANDLER FOR SQLSTATE '23000' 
  BEGIN 
    SELECT 'Erro 01: Este Associado Já existe. Consulte a lista completa antes de incluir.' AS Msg1;
  END;
DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN 
    SELECT 'Erro 02: Ocorreu um erro inexperado. Avise a equipe do Terra do Futebol' AS Msg2;
  END;
DECLARE CONTINUE HANDLER FOR SQLWARNING
  BEGIN 
    SELECT 'Erro 03: Ocorreu um erro inexperado. Avise a equipe do Terra do Futebol' AS Msg3;
  END;
  set w_senha = p_senha;
  if p_LoginExterno <> 0 then
     set w_senha = null;
  end if;
 
  if p_Dependente = 0 then
     INSERT INTO associados (Email, 	Dependente, LoginExterno, DtNascimento,	Senha,	NomeCompleto, dtassociacao, Sexo, Ativo) 
              VALUES   (p_Email,	p_Dependente, p_LoginExterno, p_DtNascimento, w_Senha,	p_NomeCompleto, current_timestamp(),	  p_Sexo, 0);       

  else 
     SELECT Associado_Id INTO w_Responsavel FROM associados WHERE email = p_Responsavel;
     INSERT INTO associados (Email, 	Dependente, Responsavel, LoginExterno, DtNascimento,	Senha,	NomeCompleto, dtassociacao, Sexo, Ativo) 
              VALUES   ('',	p_Dependente, w_Responsavel , p_LoginExterno, p_DtNascimento, w_Senha,	p_NomeCompleto,	current_timestamp(),	  p_Sexo, 0); 
  end if;
END$$

DROP PROCEDURE IF EXISTS `prc_associados_upd`$$
CREATE DEFINER=`terraqli`@`localhost` PROCEDURE `prc_associados_upd`(
	IN `p_id` INT
	, IN `p_nome` VARCHAR(100)
        , IN `p_mae` VARCHAR(100)
	, IN `p_pai` VARCHAR(100)
	, IN `p_cpf` VARCHAR(11)
	, IN `p_rg` VARCHAR(10)
        , IN `p_nacionalidade` INT
)
    COMMENT 'Edita dados de associados'
BEGIN
DECLARE CONTINUE HANDLER FOR NOT FOUND
  BEGIN
    SELECT 'Erro 05: Associado não encontrado.' AS Msg1;
  END;
DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN 
    SELECT 'Erro 02: Ocorreu um erro inexperado. Avise a equipe do Terra do Futebol' AS Msg1;
  END;
DECLARE CONTINUE HANDLER FOR SQLWARNING
  BEGIN 
    SELECT 'Erro 03: Ocorreu um erro inexperado. Avise a equipe do Terra do Futebol' AS Msg1;
  END;

  IF (SELECT count(*) from associados WHERE associado_Id = p_id) > 0 THEN
	
	UPDATE associados
	   SET NomeCompleto = p_nome
         WHERE associado_Id = p_id
	     ;

	IF (SELECT count(*) from associados_complemento WHERE associado_Id = p_id) = 0 THEN
		INSERT INTO associados_complemento
			    (associado_Id,Mae,Pai,CPF,RG,Nacionalidade) 
                     VALUES 
			    (p_id,p_mae,p_pai,p_cpf,p_rg,p_nacionalidade)
                     ;
	ELSE
		UPDATE associados_complemento
		   SET Mae = p_mae
                       , Pai = p_pai
		       , CPF = p_cpf
                       , RG = p_rg
		       , Nacionalidade = p_nacionalidade
		 WHERE associado_Id = p_id
                     ;
	END IF;
  END IF;
END$$

DROP PROCEDURE IF EXISTS `prc_categoria_futebol_Ins`$$
CREATE DEFINER=`terraqli`@`localhost` PROCEDURE `prc_categoria_futebol_Ins`(IN `p_categoria_descricao` VARCHAR(50), IN `p_categoria_descricaocompl` VARCHAR(100))
BEGIN
DECLARE EXIT HANDLER FOR SQLSTATE '23000'
  BEGIN 
    SELECT 'Erro 01: Esta Categoria/Nome já existe. Consulte a lista completa antes de incluir.' AS Msg1;
  END;
DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN 
    SELECT 'Erro 02: Ocorreu um erro inexperado. Avise a equipe do Terra do Futebol' AS Msg1;
  END;
DECLARE CONTINUE HANDLER FOR SQLWARNING
  BEGIN 
    SELECT 'Erro 03: Ocorreu um erro inexperado. Avise a equipe do Terra do Futebol' AS Msg3;
  END;

  INSERT INTO categorias_futebol 
  (categoria_descricao, categoria_descricaocompl) VALUES (p_categoria_descricao, p_categoria_descricaocompl);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `associados`
--

DROP TABLE IF EXISTS `associados`;
CREATE TABLE IF NOT EXISTS `associados` (
  `Associado_Id` int(11) NOT NULL COMMENT 'Chave Primaria do Associado - Número Sequencial',
  `Dependente` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0-Principal, 1=Dependente',
  `Email` varchar(100) NOT NULL COMMENT 'Email do Associado',
  `Responsavel` int(11) NOT NULL DEFAULT '0' COMMENT 'Id do Responsável',
  `DtNascimento` date NOT NULL COMMENT 'Data de Nascimento do Associado',
  `Senha` varchar(32) DEFAULT NULL COMMENT 'Senha do Associado',
  `LoginExterno` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=Login Normal, 1=Login pelo Facebook, 2=Google',
  `NomeCompleto` varchar(100) NOT NULL COMMENT 'Nome Completo do Associado',
  `SenhaAnterior` varchar(10) DEFAULT NULL COMMENT 'Senha Anterior',
  `DtAtualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da última Atualização do Registro',
  `DtAssociacao` datetime NOT NULL COMMENT 'Data da Associação do usuário',
  `Sexo` int(11) NOT NULL COMMENT 'Sexo do Associado',
  `Ativo` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Identifica se o usuário está Ativo (1)  ou Não (0)'
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COMMENT='tabela que conterá os dados principais dos associados do Terra do Futebol';

--
-- Dumping data for table `associados`
--

INSERT INTO `associados` (`Associado_Id`, `Dependente`, `Email`, `Responsavel`, `DtNascimento`, `Senha`, `LoginExterno`, `NomeCompleto`, `SenhaAnterior`, `DtAtualizacao`, `DtAssociacao`, `Sexo`, `Ativo`) VALUES
(2, 0, 'fernandosiebra@gmail.com', 0, '1992-02-23', 'e08787f792e410fff234715799c310ab', 0, 'Fernando Siebra', NULL, '2016-07-26 03:57:23', '2016-07-26 03:57:14', 19, 1),
(3, 0, 'marco@globalti.com.br', 0, '1968-12-14', '1308dfed71297a652cc42a390e211489', 0, 'marco', NULL, '2016-09-20 18:17:24', '2016-09-20 18:14:39', 19, 1),
(4, 0, 'fabio@flauzinoimoveis.com.br', 0, '1971-04-28', 'b61b6b1f96d3b22022c8a44d1e130c9e', 0, 'Fabio Alves da Silva', NULL, '2016-09-20 22:06:18', '2016-09-20 22:06:18', 19, 0),
(5, 0, 'contato@diogenesjunior.com.br', 0, '1995-01-26', 'b265653ea70d61ab4bb60414390191f3', 0, 'Diogenes Junior', NULL, '2016-10-10 21:16:50', '2016-10-10 21:16:50', 19, 0);

-- --------------------------------------------------------

--
-- Table structure for table `associados_complemento`
--

DROP TABLE IF EXISTS `associados_complemento`;
CREATE TABLE IF NOT EXISTS `associados_complemento` (
  `associado_Id` int(11) NOT NULL COMMENT 'Código do Associado (Tabela TF_Associados)',
  `CPF` varchar(11) DEFAULT NULL COMMENT 'CPF do Associado',
  `RG` varchar(10) DEFAULT NULL COMMENT 'RG do Associado',
  `TipoDocto` varchar(10) DEFAULT NULL COMMENT 'Tipo de Documento de Estrangeiro (Passaporte, RNE)',
  `Estrangeiro` varchar(10) DEFAULT NULL COMMENT 'Número do Documento de Estrangeiro',
  `Nacionalidade` int(11) DEFAULT NULL COMMENT 'País de Nacionalidade do Associado (tabela de Países)',
  `Naturalidade` int(11) DEFAULT NULL COMMENT 'Se país Brasil, pegar tabela de Estados',
  `Mae` varchar(100) NOT NULL COMMENT 'Nome da Mãe',
  `Pai` varchar(100) DEFAULT NULL COMMENT 'Nome do Pai',
  `PrefixoPais` varchar(5) NOT NULL DEFAULT '+55' COMMENT 'Prefixo de telefone do País (Brasil = +55)',
  `Tipofone1` int(2) NOT NULL COMMENT 'Tipos de Telefone1 (Tabela de Tipo de Telefone)',
  `Tipofone2` int(2) NOT NULL COMMENT 'Tipos de Telefone2 (Tabela de Tipo de Telefone)',
  `Tipofone3` int(2) NOT NULL COMMENT 'Tipos de Telefone3 (Tabela de Tipo de Telefone)',
  `Tipofone4` int(2) NOT NULL COMMENT 'Tipos de Telefone4 (Tabela de Tipo de Telefone)',
  `Foneddd1` int(5) NOT NULL COMMENT 'DDD do Telefone1',
  `Foneddd2` int(5) NOT NULL COMMENT 'DDD do Telefone2',
  `Foneddd3` int(5) NOT NULL COMMENT 'DDD do Telefone3',
  `Foneddd4` int(5) NOT NULL COMMENT 'DDD do Telefone4',
  `Fone1` varchar(10) NOT NULL COMMENT 'Número Fone1',
  `Fone2` varchar(10) NOT NULL COMMENT 'Número Fone2',
  `Fone3` varchar(10) NOT NULL COMMENT 'Número Fone3',
  `Fone4` varchar(10) NOT NULL COMMENT 'Número Fone4',
  `Complfone1` varchar(50) NOT NULL COMMENT 'Complemento do fone1',
  `Complfone2` varchar(50) NOT NULL COMMENT 'Complemento do fone2',
  `Complfone3` varchar(50) NOT NULL COMMENT 'Complemento do fone3',
  `Complfone4` varchar(50) NOT NULL COMMENT 'Complemento do fone4',
  `OperadoraFone1` int(3) NOT NULL COMMENT 'Operadora Fone1 (Tabela de Operadoras)',
  `OperadoraFone2` int(3) NOT NULL COMMENT 'Operadora Fone2 (Tabela de Operadoras)',
  `OperadoraFone3` int(3) NOT NULL COMMENT 'Operadora Fone3 (Tabela de Operadoras)',
  `OperadoraFone4` int(3) NOT NULL COMMENT 'Operadora Fone4 (Tabela de Operadoras)',
  `Assoccompl_Endereco_foto` varchar(50) NOT NULL COMMENT 'Endereço da Foto Principal do Associado'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de complemento de informações dos associados.';

--
-- Dumping data for table `associados_complemento`
--

INSERT INTO `associados_complemento` (`associado_Id`, `CPF`, `RG`, `TipoDocto`, `Estrangeiro`, `Nacionalidade`, `Naturalidade`, `Mae`, `Pai`, `PrefixoPais`, `Tipofone1`, `Tipofone2`, `Tipofone3`, `Tipofone4`, `Foneddd1`, `Foneddd2`, `Foneddd3`, `Foneddd4`, `Fone1`, `Fone2`, `Fone3`, `Fone4`, `Complfone1`, `Complfone2`, `Complfone3`, `Complfone4`, `OperadoraFone1`, `OperadoraFone2`, `OperadoraFone3`, `OperadoraFone4`, `Assoccompl_Endereco_foto`) VALUES
(2, '499378763', '4143157780', NULL, NULL, 1, NULL, 'Vanuza Siebra', 'Reginaldo Cordeiro', '+55', 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '', '', 0, 0, 0, 0, ''),
(3, '', '', NULL, NULL, 1, NULL, '', '', '+55', 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '', '', 0, 0, 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `categorias_futebol`
--

DROP TABLE IF EXISTS `categorias_futebol`;
CREATE TABLE IF NOT EXISTS `categorias_futebol` (
  `categoria_id` int(11) NOT NULL COMMENT 'chave primaria',
  `categoria_descricao` varchar(50) NOT NULL COMMENT 'Descrição da categoria',
  `categoria_descricaocompl` varchar(100) DEFAULT NULL COMMENT 'Descrição detalhada da categoria'
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1 COMMENT='Tabela de Categorias de futebol por Tipo';

--
-- Dumping data for table `categorias_futebol`
--

INSERT INTO `categorias_futebol` (`categoria_id`, `categoria_descricao`, `categoria_descricaocompl`) VALUES
(12, 'Junior (sub-20)', NULL),
(13, 'Principal (Sport) - Idade Livre', NULL),
(4, 'Sub-10', NULL),
(5, 'Sub-11', NULL),
(6, 'Sub-12', NULL),
(7, 'Sub-13', NULL),
(8, 'Sub-14', NULL),
(9, 'Sub-15', NULL),
(10, 'Sub-16', NULL),
(11, 'Sub-17', NULL),
(1, 'Sub-7', NULL),
(2, 'Sub-8', NULL),
(3, 'Sub-9', NULL),
(14, 'Super-30 (Adulto - acima de 30)', NULL),
(15, 'Super-40 (Master - acima de 40)', NULL),
(16, 'Super-50 (Veterano - acima de 50)', NULL),
(17, 'Super-60 (Veteraníssimo - acima de 60)', NULL),
(18, 'Super-70 (Veterníssimo Especial - acima de 70)', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cidades`
--

DROP TABLE IF EXISTS `cidades`;
CREATE TABLE IF NOT EXISTS `cidades` (
  `Cidade_id` int(11) NOT NULL COMMENT 'Chave Primaria',
  `Cidade_nome` varchar(100) NOT NULL COMMENT 'Nome da Cidade',
  `Cidade_Estadoid` int(11) NOT NULL COMMENT 'Estado a qual pertence a Cidade'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de Cidades';

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
CREATE TABLE IF NOT EXISTS `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `state_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `convitejogo`
--

DROP TABLE IF EXISTS `convitejogo`;
CREATE TABLE IF NOT EXISTS `convitejogo` (
  `Convite_Id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Equipe_Id` int(11) NOT NULL COMMENT 'Equipe que irá fazer o convite',
  `EquipeConvidada_Id` int(11) NOT NULL COMMENT 'Equipe Convidada',
  `DtConvite` datetime NOT NULL COMMENT 'Data do Convite',
  `DtJogo` datetime NOT NULL COMMENT 'Data do Jogo',
  `DtJogoOpcional` datetime DEFAULT NULL COMMENT 'Data Opcional para o Jogo',
  `StatusConvite` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Se outra equipe aceitar outro convite, os demais devem ser cancelados 0=sem resposta, 1=Confirmado, 9=Cancelado',
  `EmailAnfitriao` varchar(50) NOT NULL COMMENT 'Email de contato do Anfitrião',
  `EmailConvidado` varchar(50) NOT NULL COMMENT 'Email de contato do Convidado',
  `EnvioSMS` tinyint(1) NOT NULL COMMENT '0=Não, 1=Sim',
  `OperadoraFoneAnfitriao` tinyint(1) NOT NULL COMMENT 'Operadora Telefônica do Convidado',
  `TipoFoneAnfitriao` varchar(20) NOT NULL COMMENT 'Tipo do Fone do Anfitrião',
  `DDDFoneAnfitriao` varchar(20) NOT NULL COMMENT 'DDD do Fone do Anfitrião',
  `FoneAnfitriao` varchar(20) NOT NULL COMMENT 'Fone de Contato do Anfitrião',
  `ComplementofoneAnfitriao` varchar(20) NOT NULL COMMENT 'Complemento do Fone do Anfitrião',
  `OperadoraFoneConvidado` varchar(20) NOT NULL COMMENT 'Operadora Telefônica do Convidado',
  `TipoFoneConvidado` varchar(20) NOT NULL COMMENT 'Tipo do Fone',
  `DDDFoneConvidado` varchar(20) NOT NULL COMMENT 'DDD do fone do Convidado',
  `FoneContatoConvidado` varchar(20) NOT NULL COMMENT 'Fone de Contato do Convidado',
  `ComplementoFoneConvidado` varchar(20) NOT NULL COMMENT 'Complemento do Fone do Convidado',
  `TextoConvite` varchar(200) NOT NULL COMMENT 'Texto do Convite',
  `ExcecaoJogo` varchar(200) NOT NULL COMMENT 'Detalhes de exceções de Jogadores, observações, etc',
  `EnderecoJogoId` int(11) DEFAULT NULL COMMENT 'Id do Endereço, se já cadastrado',
  `CepEnderecoJogo` varchar(8) NOT NULL COMMENT 'Cep do Endereço do Jogo',
  `Logradouro` varchar(200) DEFAULT NULL COMMENT 'Endereço do Campo',
  `LogradouroComplemento` varchar(100) DEFAULT NULL COMMENT 'Complemento do Logradouro',
  `Bairro` varchar(100) DEFAULT NULL COMMENT 'Bairro do Endereço do Jogo',
  `DetalheEndereco` varchar(100) DEFAULT NULL COMMENT 'Colocar detalhes do Campo, etc',
  `Latitude` varchar(50) DEFAULT NULL COMMENT 'Latitude para posicionamento em Mapa',
  `Logitude` varchar(50) DEFAULT NULL COMMENT 'Longitude para posicionamento em Mapa'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de Convite de Jogo Amistoso';

-- --------------------------------------------------------

--
-- Table structure for table `convitejogo_retorno`
--

DROP TABLE IF EXISTS `convitejogo_retorno`;
CREATE TABLE IF NOT EXISTS `convitejogo_retorno` (
  `ConviteRetorno_Id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Convite_Id` int(11) NOT NULL COMMENT 'Id do Convite',
  `Confirmado` tinyint(1) DEFAULT NULL COMMENT 'Nulo=Sem Status, 0=não aceito, 1=Confirmado',
  `TextoResposta` varchar(200) DEFAULT NULL COMMENT 'Texto de Retorno',
  `DtRetorno` datetime NOT NULL COMMENT 'Data do retorno'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Retornos do Convite. Podem haver vários retornos, quando 1 estiver confirmado ou não Aceito, atualizar o Status da Tabela ConviteJogo';

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL,
  `language` varchar(4) NOT NULL,
  `flag` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `enderecos`
--

DROP TABLE IF EXISTS `enderecos`;
CREATE TABLE IF NOT EXISTS `enderecos` (
  `endereco_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `entidade_id` int(11) DEFAULT NULL COMMENT 'Chave única composta de entidade,associado e equipe',
  `associado_id` int(11) DEFAULT NULL COMMENT 'Chave única composta de entidade,associado e equipe',
  `equipe_id` int(11) DEFAULT NULL COMMENT 'Chave única composta de entidade,associado e equipe',
  `tipoendereco_id` int(11) NOT NULL COMMENT 'Tabela de Tipos do Endereço',
  `CEP` varchar(8) NOT NULL COMMENT 'CEP',
  `Logradouro` varchar(100) NOT NULL COMMENT 'Logradouro do Endereço Principal',
  `Logradourocompl` varchar(50) NOT NULL COMMENT 'Complemento do Logradouro',
  `Bairro` varchar(100) NOT NULL COMMENT 'Bairro do Endereço principal do Associado',
  `cidade_id` int(11) NOT NULL COMMENT 'Cidade do Endereço principal do Associado (Tabela de Cidades)',
  `observacoes` text COMMENT 'Texto livre para Comentários'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela que contém os enderecos das entidades (pj) do portal (Clubes, Entidades, Agremiações), Associados e Equipes';

-- --------------------------------------------------------

--
-- Table structure for table `entidades`
--

DROP TABLE IF EXISTS `entidades`;
CREATE TABLE IF NOT EXISTS `entidades` (
  `Entidade_id` int(11) NOT NULL COMMENT 'Chave Primária de Empresa/clube/associação/agremiação',
  `Status` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Status TF , 0 Inativo, 1 Ativo',
  `TipoEntidade_id` int(11) NOT NULL COMMENT 'Tabela Tipos de Entidade',
  `Associado_Id` int(11) NOT NULL COMMENT 'Id do associado responsável',
  `NomeFantasia` varchar(255) NOT NULL COMMENT 'Nome Fantasia da Empresa/clube/associação/agremiação',
  `NomeAgregado` varchar(255) NOT NULL COMMENT 'nome abreviado ou mais conhecido',
  `RazaoSocial` varchar(255) DEFAULT NULL COMMENT 'Razão social da Empresa/clube/associação/agremiação',
  `Cnpj` varchar(20) DEFAULT NULL COMMENT 'CNPJ da Empresa/clube/associação/agremiação',
  `InscricaoEstadual` varchar(20) DEFAULT NULL COMMENT 'Inscrição Estadual',
  `NomeContato` varchar(50) DEFAULT NULL COMMENT 'Pessoa de contato',
  `DataFundacao` date DEFAULT NULL COMMENT 'Data de Fundação',
  `RespAdministrativo` int(11) DEFAULT NULL COMMENT 'id do associado responsável pela administração',
  `AuxAdministrativo` int(11) DEFAULT NULL COMMENT 'id do associdao auxiliar administrativo',
  `NroIntegrantes` int(11) DEFAULT NULL COMMENT 'Número de associados, integrantes, colaboradores',
  `FotoBrasao` varchar(255) DEFAULT NULL COMMENT 'foto do Brasão do Clube',
  `DtAssociacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de Cadastro',
  `Observacoes` varchar(500) DEFAULT NULL COMMENT 'Texto livre para Comentários'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela que contém as empresas, clubes, associações e agremiações que possuem equipes no Portal';

-- --------------------------------------------------------

--
-- Table structure for table `equipes`
--

DROP TABLE IF EXISTS `equipes`;
CREATE TABLE IF NOT EXISTS `equipes` (
  `equipe_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `status` tinyint(1) DEFAULT '1' COMMENT 'Status da Equipe, se ativa=1',
  `entidade_id` int(11) DEFAULT NULL COMMENT 'Código da Entidade ao qual está associada',
  `responsavel_id` int(11) NOT NULL COMMENT 'Responsável pela equipe',
  `administrador_id` int(11) NOT NULL COMMENT 'Administrador da equipe',
  `nomecompleto` varchar(255) NOT NULL COMMENT 'Nome Completo',
  `nome_agregado` varchar(255) NOT NULL COMMENT 'Nome agregado, quando o nome completo pode coincidir. Usar bairro ou Vila',
  `categoria_id` int(11) DEFAULT NULL COMMENT 'Categoria de Futebol da Equipe',
  `dtatualizacaocategoriaid` datetime DEFAULT NULL COMMENT 'Data da última atualização da Categoria',
  `tipofutebol_id` int(11) DEFAULT NULL COMMENT 'Tipo de Futebol que a equipe joga',
  `fotoprincipal` varchar(255) DEFAULT NULL COMMENT 'Endereço da Foto Principal da equipe',
  `fotobrasao` varchar(255) DEFAULT NULL COMMENT 'Endereço da foto do Brasão',
  `fotouniformeprincipal` varchar(255) DEFAULT NULL COMMENT 'Endereço da foto do Uniforme Principal',
  `fotouniforme2` varchar(255) DEFAULT NULL COMMENT 'Foto do Uniforme 2',
  `fotouniforme3` varchar(255) DEFAULT NULL COMMENT 'Foto do Uniforme 3'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de informações dos Times';

-- --------------------------------------------------------

--
-- Table structure for table `equipes_complemento`
--

DROP TABLE IF EXISTS `equipes_complemento`;
CREATE TABLE IF NOT EXISTS `equipes_complemento` (
  `equipecompl_id` int(11) NOT NULL COMMENT 'equipe_id da tabela de equipes',
  `tecnico_id` int(11) DEFAULT NULL COMMENT 'técnico da equipe (tabela associados)',
  `auxiliar_id` int(11) DEFAULT NULL COMMENT 'Auxiliar da equipe (tabela associados)',
  `nomecontato` varchar(255) DEFAULT NULL COMMENT 'Nome do Contato da equipe',
  `dtfundacao` date DEFAULT NULL COMMENT 'Data da Fundação da Equipe',
  `tipo_fone1` int(2) NOT NULL COMMENT 'Tipos de Telefone1 (Tabela de Tipo de Telefone)',
  `tipo_fone2` int(2) NOT NULL COMMENT 'Tipos de Telefone2 (Tabela de Tipo de Telefone)',
  `tipo_fone3` int(2) NOT NULL COMMENT 'Tipos de Telefone3 (Tabela de Tipo de Telefone)',
  `tipo_fone4` int(2) NOT NULL COMMENT 'Tipos de Telefone4 (Tabela de Tipo de Telefone)',
  `ddd1` int(5) NOT NULL COMMENT 'DDD do Telefone1',
  `ddd2` int(5) NOT NULL COMMENT 'DDD do Telefone2',
  `ddd3` int(5) NOT NULL COMMENT 'DDD do Telefone3',
  `ddd4` int(5) NOT NULL COMMENT 'DDD do Telefone4',
  `fone1` varchar(10) NOT NULL COMMENT 'Número Fone1',
  `fone2` varchar(10) NOT NULL COMMENT 'Número Fone2',
  `fone3` varchar(10) NOT NULL COMMENT 'Número Fone3',
  `fone4` varchar(10) NOT NULL COMMENT 'Número Fone4',
  `complfone1` varchar(50) NOT NULL COMMENT 'Complemento do fone1',
  `complfone2` varchar(50) NOT NULL COMMENT 'Complemento do fone2',
  `complfone3` varchar(50) NOT NULL COMMENT 'Complemento do fone3',
  `complfone4` varchar(50) NOT NULL COMMENT 'Complemento do fone4',
  `Oper1` int(3) NOT NULL COMMENT 'Operadora Fone1 (Tabela de Operadoras)',
  `Oper2` int(3) NOT NULL COMMENT 'Operadora Fone2 (Tabela de Operadoras)',
  `Oper3` int(3) NOT NULL COMMENT 'Operadora Fone3 (Tabela de Operadoras)',
  `Oper4` int(3) NOT NULL COMMENT 'Operadora Fone4 (Tabela de Operadoras)',
  `historia` longtext COMMENT 'História da equipe',
  `AceitaAmistoso` tinyint(4) NOT NULL DEFAULT '1' COMMENT 'Aceita Jogo Amistoso no Seu Campo ? 0=Não, 1=Sim',
  `AceitaJogoOutroHorario` tinyint(4) NOT NULL DEFAULT '1' COMMENT 'Aceita Jogo Fora do seu dia e horário habitual ?',
  `AceitaJogarFora` tinyint(4) NOT NULL DEFAULT '1' COMMENT 'Aceita Jogar Fora do seu Campo ?',
  `Diadasemanaquejoga` varchar(50) NOT NULL DEFAULT '1' COMMENT 'Dias da Semana que Joga',
  `AceitaJogoForaDaCategoria` tinyint(4) NOT NULL DEFAULT '1' COMMENT 'Aceita Jogar com equipes fora da categoria ?',
  `AceitaJogoForaDoTipoFutebol` tinyint(4) NOT NULL DEFAULT '1' COMMENT 'Aceita Jogar em outros Tipos de Futebol/Campo ?',
  `Horariojogo` varchar(50) NOT NULL DEFAULT '1' COMMENT 'Horário que Joga',
  `observacoes` varchar(255) DEFAULT NULL COMMENT 'Observações'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de Complemento de dados de Equipes';

-- --------------------------------------------------------

--
-- Table structure for table `equipe_jogadores`
--

DROP TABLE IF EXISTS `equipe_jogadores`;
CREATE TABLE IF NOT EXISTS `equipe_jogadores` (
  `EquipeJogador_Id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Equipe_Id` int(11) NOT NULL COMMENT 'Chave Única',
  `Jogador_Id` int(11) NOT NULL COMMENT 'Chave Única',
  `Dt_Inicial` date NOT NULL,
  `Dt_Final` date DEFAULT NULL,
  `Dt_Atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Posicao_id1` int(11) DEFAULT NULL COMMENT 'Posicão Preferencial',
  `Posicao_id2` int(11) DEFAULT NULL COMMENT '2a. Opção de Posição',
  `Posicao_id3` int(11) DEFAULT NULL COMMENT '3a. Opção de posição',
  `Comentarios` varchar(200) DEFAULT NULL,
  `Convidado` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Se foi Convidado (0=Não, 1=Sim)',
  `Ativo` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=Inativo, 1=Ativo'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de Jogadores por Equipe';

-- --------------------------------------------------------

--
-- Table structure for table `estados`
--

DROP TABLE IF EXISTS `estados`;
CREATE TABLE IF NOT EXISTS `estados` (
  `Estado_id` int(11) NOT NULL COMMENT 'Chave da Tabela Estados',
  `nome` varchar(75) NOT NULL COMMENT 'Nome do Estado ou Distrito',
  `uf` varchar(5) DEFAULT NULL COMMENT 'Sigla do Estado',
  `regiao` varchar(75) DEFAULT NULL COMMENT 'Região do Estado',
  `Pais_id` int(11) NOT NULL COMMENT 'País (Tabela Países)'
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1 COMMENT='Tabela de Estados';

--
-- Dumping data for table `estados`
--

INSERT INTO `estados` (`Estado_id`, `nome`, `uf`, `regiao`, `Pais_id`) VALUES
(1, 'São Paulo', 'SP', 'Sudeste', 1),
(2, 'Rio de Janeiro', 'RJ', 'Sudeste', 1),
(3, 'Minas Gerais', 'MG', 'Sudeste', 1),
(4, 'Paraná', 'PR', 'Sul', 1),
(5, 'Santa Catarina', 'SC', 'Sul', 1),
(6, 'Rio Grande do Sul', 'RS', 'Sul', 1),
(7, 'Espirito Santo', 'ES', 'Sudeste', 1),
(8, 'Mato Grosso', 'MT', 'Centro Oeste', 1),
(9, 'Mato Grosso do Sul', 'MS', 'Centro Oeste', 1),
(10, 'Goiás', 'GO', 'Centro Oeste', 1),
(11, 'Tocantins', 'TO', 'Centro Oeste', 1),
(12, 'Brasilia', 'DF', 'Centro Oeste', 1),
(13, 'Acre', 'AC', 'Norte', 1),
(14, 'Roraima', 'RR', 'Norte', 1),
(15, 'Rondônia', 'RO', 'Norte', 1),
(16, 'Amazonas', 'AM', 'Norte', 1),
(17, 'Amapá', 'AP', 'Norte', 1),
(18, 'Pará', 'PA', 'Norte', 1),
(19, 'Maranhão', 'MA', 'Nordeste', 1),
(20, 'Rio Grande do Norte', 'RN', 'Nordeste', 1),
(21, 'Ceará', 'CE', 'Nordeste', 1),
(22, 'Piauí', 'PI', 'Nordeste', 1),
(23, 'Paraíba', 'PB', 'Nordeste', 1),
(24, 'Bahia', 'BA', 'Nordeste', 1),
(25, 'Sergipe', 'SE', 'Nordeste', 1),
(26, 'Pernambuco', 'PE', 'Nordeste', 1),
(27, 'Alagoas', 'AL', 'Nordeste', 1);

-- --------------------------------------------------------

--
-- Table structure for table `eventos_jogo`
--

DROP TABLE IF EXISTS `eventos_jogo`;
CREATE TABLE IF NOT EXISTS `eventos_jogo` (
  `Jogo_Id` int(11) NOT NULL,
  `Equipe_Id` int(11) DEFAULT NULL COMMENT 'Equipe que realizou o lance de jogo',
  `Tipoevento_id` int(11) DEFAULT NULL COMMENT 'Acontecimento do Jogo',
  `Jogador_Id` int(11) DEFAULT NULL COMMENT 'Jogador do evento',
  `TempoJogo` int(11) DEFAULT NULL COMMENT 'Tempo em minutos do acontecimento',
  `ParteJogo` int(11) NOT NULL COMMENT '1o. tempo, 2o, tempo, 3o. Tempo, Prorrogação',
  `Complemento` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela que conterá todos os eventos do Jogo.';

-- --------------------------------------------------------

--
-- Table structure for table `jogadores`
--

DROP TABLE IF EXISTS `jogadores`;
CREATE TABLE IF NOT EXISTS `jogadores` (
  `jogador_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `associado_id` int(11) NOT NULL COMMENT 'Código de Associado',
  `apelido` varchar(255) NOT NULL COMMENT 'Apelido como Jogador',
  `foto` varchar(255) NOT NULL COMMENT 'Foto de Jogador',
  `DtCadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de Cadastamento como Jogador',
  `TipoFutebol_id` int(11) DEFAULT NULL COMMENT 'Tipo de Futebol Preferido',
  `ProcurandoTime` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Procurando time para jogar ? (0=não,1=Sim)',
  `AceitaConviteparaJogar` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Aceita convite de Times para Jogar ? (0=Não,1=Sim)',
  `TamanhoTenis` int(11) DEFAULT NULL COMMENT 'Tamanho do Tenis/chuteira (Bra)',
  `TamanhoCamisa` char(3) DEFAULT 'M' COMMENT 'PP, P, M, G, GG, XGG',
  `TamanhoCalcao` char(3) DEFAULT 'M' COMMENT 'PP, P, M, G, GG, XGG',
  `TamanhoCalcaAlt` int(2) DEFAULT NULL COMMENT 'Número Padrão Americano (Ex.: 28, 29, 30)',
  `TamanhoCalcaLarg` int(2) DEFAULT NULL COMMENT 'Número Padrão Americano (Ex.: 28, 29, 30)'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de cadastro de jogadores';

-- --------------------------------------------------------

--
-- Table structure for table `jogador_posição`
--

DROP TABLE IF EXISTS `jogador_posição`;
CREATE TABLE IF NOT EXISTS `jogador_posição` (
  `jogador_id` int(11) NOT NULL COMMENT 'Chave Primária, oriunda da tabela jogadores',
  `Associado_id` int(11) NOT NULL COMMENT 'Código do Associado',
  `Preferencia` int(11) NOT NULL COMMENT 'Ordem de preferência (1,2,3)',
  `tipofutebol_id` int(11) NOT NULL COMMENT 'Chave Primária, oriunda da tabela tipos de futebol',
  `tipofutebolposicao_id` int(11) NOT NULL COMMENT 'Chave Primária, oriunda da tabela de tipo de futebol posição',
  `Observações` int(11) NOT NULL COMMENT 'Observações'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de posições do jogador por tipo de futebol';

-- --------------------------------------------------------

--
-- Table structure for table `jogo`
--

DROP TABLE IF EXISTS `jogo`;
CREATE TABLE IF NOT EXISTS `jogo` (
  `Jogo_Id` int(11) NOT NULL COMMENT 'Chave Primária',
  `DtJogo` datetime NOT NULL COMMENT 'Data e Horário marcado para o Jogo',
  `Endereco_Id` int(11) NOT NULL COMMENT 'Endereço onde acontecerá o Jogo',
  `Equipe_Id` int(11) NOT NULL COMMENT 'Equipe Anfitriã',
  `Equipe_Id_convidada` int(11) NOT NULL COMMENT 'Equipe Convidada',
  `Status` tinyint(4) NOT NULL COMMENT '0-Não Realizada, 1-Realizada, 9-Cancelada,',
  `Comentario` varchar(200) NOT NULL COMMENT 'Comentários do Jogo'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabela de Jogos';

-- --------------------------------------------------------

--
-- Table structure for table `operadoras_telefone`
--

DROP TABLE IF EXISTS `operadoras_telefone`;
CREATE TABLE IF NOT EXISTS `operadoras_telefone` (
  `Operadora_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Nome` varchar(50) NOT NULL COMMENT 'Nome da Operadora'
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COMMENT='Tabela de Operadoras de Telefone';

--
-- Dumping data for table `operadoras_telefone`
--

INSERT INTO `operadoras_telefone` (`Operadora_id`, `Nome`) VALUES
(1, 'Telefônica'),
(2, 'Embratel'),
(3, 'Claro'),
(4, 'TIM'),
(5, 'Vesper'),
(6, 'OI'),
(7, 'Vivo'),
(8, 'Brasil Telecom');

-- --------------------------------------------------------

--
-- Table structure for table `paises`
--

DROP TABLE IF EXISTS `paises`;
CREATE TABLE IF NOT EXISTS `paises` (
  `Pais_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Nome` varchar(50) NOT NULL COMMENT 'Nome do País',
  `Idioma` varchar(50) DEFAULT NULL COMMENT 'Principal Idioma utilizado'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COMMENT='Tabela de Países';

--
-- Dumping data for table `paises`
--

INSERT INTO `paises` (`Pais_id`, `Nome`, `Idioma`) VALUES
(1, 'Brasil', 'Português');

-- --------------------------------------------------------

--
-- Table structure for table `posicao`
--

DROP TABLE IF EXISTS `posicao`;
CREATE TABLE IF NOT EXISTS `posicao` (
  `posicao_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Nome` varchar(50) DEFAULT NULL COMMENT 'Nome da Posição',
  `Descricao` varchar(255) NOT NULL COMMENT 'Descritivo'
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COMMENT='Tabela de Posições de Jogadores';

--
-- Dumping data for table `posicao`
--

INSERT INTO `posicao` (`posicao_id`, `Nome`, `Descricao`) VALUES
(1, '4o. Zagueiro', '4o. Zagueiro(a) ou também chamado apenas de Zagueiro(a)'),
(2, 'Back Central', 'Zagueiro(a) mais Fixo, ou também chamado(a) como 1o. Zagueiro(a)'),
(3, '1o. Volante', 'Primeiro Volante (Volante mais Fixo, de Defesa, desarme)'),
(4, 'Lateral Direito', 'Ala ou Lateral, atuando pela Direita'),
(5, 'Lateral Esquerdo', 'Ala ou Lateral, atuando pela asquerd'),
(6, 'Pivô', 'Pivô de Contensão e distribuição de passes no Ataque.'),
(7, 'Atacante', 'Atacante ou Centro-avante'),
(8, 'Meia Esquesda', 'Meio de Campo, atuando mais pela Esquerda.'),
(9, 'Meia Direita', 'Meio de Campo, atuando mais pela Direita'),
(10, '2o. Volante', '3o. pessoa do meio de campo.'),
(11, 'Meia Atacante', '2o. Atacante, atuando como um meio campo de ligação'),
(12, 'Goleiro', 'Goleiro');

-- --------------------------------------------------------

--
-- Table structure for table `seguidores`
--

DROP TABLE IF EXISTS `seguidores`;
CREATE TABLE IF NOT EXISTS `seguidores` (
  `Seguidor_Id` int(11) NOT NULL,
  `associado_Id` int(11) NOT NULL,
  `entidade_Id` int(11) NOT NULL,
  `Equipe_Id` int(11) NOT NULL,
  `Jogador_Id` int(11) NOT NULL,
  `Dt_Inicial` date DEFAULT NULL,
  `Dt_Final` date NOT NULL,
  `Ativo` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0=Inativo, 1=Ativo',
  `AvisoEmail` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0=Não, 1=Sim',
  `AvisoSms` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0=Não, 1=Sim'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabelas de Torcedores e Seguidores';

-- --------------------------------------------------------

--
-- Table structure for table `sexos`
--

DROP TABLE IF EXISTS `sexos`;
CREATE TABLE IF NOT EXISTS `sexos` (
  `Sexo_id` int(11) NOT NULL COMMENT 'chave primaria',
  `descricao` varchar(50) NOT NULL COMMENT 'Descrição do Sexo'
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COMMENT='Tabela de Sexos';

--
-- Dumping data for table `sexos`
--

INSERT INTO `sexos` (`Sexo_id`, `descricao`) VALUES
(19, 'Masculino'),
(20, 'Feminino');

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
CREATE TABLE IF NOT EXISTS `states` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `abr` varchar(2) NOT NULL,
  `country_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tipofutebol_posicao`
--

DROP TABLE IF EXISTS `tipofutebol_posicao`;
CREATE TABLE IF NOT EXISTS `tipofutebol_posicao` (
  `tipofutebolposicao_id` int(11) NOT NULL COMMENT 'ChavePrimária',
  `posicao_id` int(11) DEFAULT NULL COMMENT 'Chave Estrangeira de Posições',
  `tipofutebol_id` int(11) DEFAULT NULL COMMENT 'Chave Estrangeira de tipos de futebol'
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1 COMMENT='Tabela de posições por Tipo de Futebol';

--
-- Dumping data for table `tipofutebol_posicao`
--

INSERT INTO `tipofutebol_posicao` (`tipofutebolposicao_id`, `posicao_id`, `tipofutebol_id`) VALUES
(1, 3, 1),
(2, 10, 1),
(3, 1, 1),
(4, 12, 1),
(5, 12, 2),
(6, 7, 1),
(7, 7, 2),
(8, 12, 4),
(9, 12, 3),
(10, 12, 5),
(11, 7, 4),
(12, 4, 4),
(13, 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `tipos_endereco`
--

DROP TABLE IF EXISTS `tipos_endereco`;
CREATE TABLE IF NOT EXISTS `tipos_endereco` (
  `Tipoendereco_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Descricao` varchar(50) NOT NULL COMMENT 'Descrição do tipo de endereço',
  `Jogo` tinyint(1) unsigned zerofill NOT NULL DEFAULT '0' COMMENT 'se 1 identifica que o Endereço se Refere a Local de Jogo'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COMMENT='Tabela de Tipos de Telefone';

--
-- Dumping data for table `tipos_endereco`
--

INSERT INTO `tipos_endereco` (`Tipoendereco_id`, `Descricao`, `Jogo`) VALUES
(1, 'Residencial', 0),
(2, 'Sede', 0),
(3, 'Comercial', 0),
(4, 'Local de Jogos 1', 1),
(5, 'Local de Jogos 2', 1),
(6, 'Local de Jogos 3', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tipos_entidades`
--

DROP TABLE IF EXISTS `tipos_entidades`;
CREATE TABLE IF NOT EXISTS `tipos_entidades` (
  `TipoEntidade_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Descrição` varchar(50) NOT NULL COMMENT 'Chave Única'
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1 COMMENT='Tipos de Entidade';

--
-- Dumping data for table `tipos_entidades`
--

INSERT INTO `tipos_entidades` (`TipoEntidade_id`, `Descrição`) VALUES
(7, 'Agremiação'),
(11, 'Campos/Quadras'),
(5, 'Clube Escola'),
(8, 'Clube Formador'),
(2, 'Clube Social'),
(1, 'Empresa'),
(4, 'Entidade Religiosa'),
(3, 'Entidade sem Fins Lucrativos'),
(6, 'Escola Privada'),
(10, 'Escola Pública'),
(9, 'Orgão Público, Prefeitura, etc');

-- --------------------------------------------------------

--
-- Table structure for table `tipos_evento`
--

DROP TABLE IF EXISTS `tipos_evento`;
CREATE TABLE IF NOT EXISTS `tipos_evento` (
  `tipoevento_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `descricao` varchar(50) NOT NULL COMMENT 'Descricao do Evento',
  `Gol` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=Não, 1=Sim, 2=Contra',
  `InfracaoGrave` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=Não,1=Simples,2=Grave',
  `Pontuacao` float NOT NULL DEFAULT '-1' COMMENT 'Pontuação do Evento no Jogo'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COMMENT='Tipos de acontecimento no Jogo\r\n';

--
-- Dumping data for table `tipos_evento`
--

INSERT INTO `tipos_evento` (`tipoevento_id`, `descricao`, `Gol`, `InfracaoGrave`, `Pontuacao`) VALUES
(1, 'Gol', 1, 0, 100),
(2, 'Gol Contra', 2, 0, -100),
(3, 'Cartão', 0, 1, 0),
(4, 'Cartão Máximo', 0, 2, 0),
(5, 'Falta', 0, 0, 0),
(6, 'Chute a Gol', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tipos_futebol`
--

DROP TABLE IF EXISTS `tipos_futebol`;
CREATE TABLE IF NOT EXISTS `tipos_futebol` (
  `tipofutebol_id` int(11) NOT NULL COMMENT 'Chave primaria',
  `tipofutebol_descricao` varchar(50) NOT NULL COMMENT 'Descricão do tipo de futebol',
  `tipofutebol_qtdejogadores` int(11) DEFAULT NULL COMMENT 'Quantidade Máxima de jogadores'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COMMENT='Tabela de tipos de futebol';

--
-- Dumping data for table `tipos_futebol`
--

INSERT INTO `tipos_futebol` (`tipofutebol_id`, `tipofutebol_descricao`, `tipofutebol_qtdejogadores`) VALUES
(1, 'Campo', 11),
(2, 'Futsal', 5),
(3, 'Society', 7),
(4, 'MiniCampo', 8),
(5, 'Show Ball', 5),
(6, 'FreeStyle', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tipos_telefone`
--

DROP TABLE IF EXISTS `tipos_telefone`;
CREATE TABLE IF NOT EXISTS `tipos_telefone` (
  `Telefone_id` int(11) NOT NULL COMMENT 'Chave Primária',
  `Descricao` varchar(50) NOT NULL COMMENT 'Descrição do Tipo do Telefone'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COMMENT='Tabela de Tipos de Telefone';

--
-- Dumping data for table `tipos_telefone`
--

INSERT INTO `tipos_telefone` (`Telefone_id`, `Descricao`) VALUES
(1, 'Residencial'),
(2, 'Celular / Radio'),
(4, 'Comercial');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL DEFAULT '0',
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL,
  `email` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL,
  `gender` int(11) NOT NULL,
  `born` date NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `rg` varchar(11) NOT NULL,
  `nationality` text NOT NULL,
  `phone_a_number` text NOT NULL,
  `phone_a_carrier` text NOT NULL,
  `phone_b_number` text NOT NULL,
  `phone_b_carrier` text NOT NULL,
  `phone_c_number` text NOT NULL,
  `phone_c_carrier` text NOT NULL,
  `photo` text NOT NULL,
  `address` text NOT NULL,
  `city` int(11) NOT NULL,
  `state` int(11) NOT NULL,
  `country` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `created_at`, `status`, `gender`, `born`, `cpf`, `rg`, `nationality`, `phone_a_number`, `phone_a_carrier`, `phone_b_number`, `phone_b_carrier`, `phone_c_number`, `phone_c_carrier`, `photo`, `address`, `city`, `state`, `country`) VALUES
(0, 'dasdas', '$2a$10$Pbh4xPbn7S8mnjcIQl.bhOwBRSLo7GpJ9MpxzR7GOOuXICmVbB9FO', '', '2016-10-31 00:06:15', 0, 0, '0000-00-00', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0),
(0, '', 'dasdasdasdasdasd', '$2a$10$2nnk1TyziNO/Li8l5heWzumjOhYUUStU0ntgBFryH1sSHV2IzE4jy', '2016-10-31 00:06:15', 0, 0, '0000-00-00', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0),
(0, '', '$2a$10$JSnCLo8x09.2R/ms0uyBZO2K2Bs18KEynidFzn8tDCgmOOYdJdHFO', 'dasdasdasdasdasd', '2016-10-31 00:06:15', 0, 0, '0000-00-00', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0),
(0, '', '$2a$10$jz7vmjxWLrZXhirN6HkL4eeUUcu.Rf2fbSbtecv5R1xoJLVpHtchG', 'melzer.caio@gmail.com', '2016-10-31 00:06:15', 0, 0, '0000-00-00', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0),
(0, '', '$2a$10$tFdn39Hu/qcMblUUGBIRkeBKSGxCJoBHph3CvUYkPAFqgPTUKSvM.', 'dasdasdasdasdasddasda', '2016-10-31 00:06:46', 0, 0, '0000-00-00', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(10) unsigned NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `associados`
--
ALTER TABLE `associados`
  ADD PRIMARY KEY (`Associado_Id`),
  ADD UNIQUE KEY `UK_associado` (`NomeCompleto`,`Email`,`DtNascimento`);

--
-- Indexes for table `associados_complemento`
--
ALTER TABLE `associados_complemento`
  ADD PRIMARY KEY (`associado_Id`);

--
-- Indexes for table `categorias_futebol`
--
ALTER TABLE `categorias_futebol`
  ADD UNIQUE KEY `uk_categoria` (`categoria_descricao`),
  ADD KEY `pk_categoria` (`categoria_id`);

--
-- Indexes for table `cidades`
--
ALTER TABLE `cidades`
  ADD KEY `pk_cidades` (`Cidade_id`),
  ADD KEY `fk_cidade_estado` (`Cidade_Estadoid`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `convitejogo`
--
ALTER TABLE `convitejogo`
  ADD PRIMARY KEY (`Convite_Id`),
  ADD KEY `fk_Convite_equipe1` (`Equipe_Id`),
  ADD KEY `fk_Convite_equipe2` (`EquipeConvidada_Id`),
  ADD KEY `fk_Convite_Enderecos` (`EnderecoJogoId`);

--
-- Indexes for table `convitejogo_retorno`
--
ALTER TABLE `convitejogo_retorno`
  ADD KEY `pk_convitejogoretorno` (`ConviteRetorno_Id`),
  ADD KEY `fk_conviteretornojogo_convite` (`Convite_Id`);

--
-- Indexes for table `enderecos`
--
ALTER TABLE `enderecos`
  ADD PRIMARY KEY (`endereco_id`),
  ADD UNIQUE KEY `uk_enderecos` (`entidade_id`,`associado_id`,`equipe_id`),
  ADD KEY `fk_enderecos_associado` (`associado_id`),
  ADD KEY `fk_enderecos_tipoendereco` (`tipoendereco_id`),
  ADD KEY `fk_enderecos_cidade` (`cidade_id`);

--
-- Indexes for table `entidades`
--
ALTER TABLE `entidades`
  ADD PRIMARY KEY (`Entidade_id`),
  ADD KEY `UK_Entidades` (`NomeAgregado`,`RazaoSocial`),
  ADD KEY `fk_entidades_tiposentidades` (`TipoEntidade_id`),
  ADD KEY `fk_entidades_associados1` (`Associado_Id`),
  ADD KEY `fk_entidades_associados2` (`RespAdministrativo`),
  ADD KEY `fk_entidades_associados3` (`AuxAdministrativo`);

--
-- Indexes for table `equipes`
--
ALTER TABLE `equipes`
  ADD PRIMARY KEY (`equipe_id`),
  ADD KEY `fk_equipes_categoriafutebol` (`categoria_id`),
  ADD KEY `fk_equipes_tipofutebol` (`tipofutebol_id`),
  ADD KEY `fk_equipes_entidade` (`entidade_id`),
  ADD KEY `fk_equipes_associados1` (`responsavel_id`),
  ADD KEY `fk_equipes_associados2` (`administrador_id`);

--
-- Indexes for table `equipes_complemento`
--
ALTER TABLE `equipes_complemento`
  ADD PRIMARY KEY (`equipecompl_id`),
  ADD KEY `fk_equipescompl_associado1` (`tecnico_id`),
  ADD KEY `fk_equipescompl_associado2` (`auxiliar_id`);

--
-- Indexes for table `equipe_jogadores`
--
ALTER TABLE `equipe_jogadores`
  ADD PRIMARY KEY (`EquipeJogador_Id`),
  ADD UNIQUE KEY `UK_equipesjogadores` (`Jogador_Id`,`Equipe_Id`),
  ADD KEY `fk_equipes` (`Equipe_Id`),
  ADD KEY `fk_posicao1` (`Posicao_id1`),
  ADD KEY `fk_posicao2` (`Posicao_id2`),
  ADD KEY `fk_posicao3` (`Posicao_id3`);

--
-- Indexes for table `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`Estado_id`),
  ADD KEY `fk_estado_paises` (`Pais_id`);

--
-- Indexes for table `eventos_jogo`
--
ALTER TABLE `eventos_jogo`
  ADD PRIMARY KEY (`Jogo_Id`),
  ADD KEY `fk_eventsojogo_Equipe` (`Equipe_Id`),
  ADD KEY `fk_eventosJogo_TipoEvento` (`Tipoevento_id`);

--
-- Indexes for table `jogadores`
--
ALTER TABLE `jogadores`
  ADD PRIMARY KEY (`jogador_id`),
  ADD KEY `fk_jogador_associado` (`associado_id`),
  ADD KEY `fk_jogador_tipofutebol` (`TipoFutebol_id`);

--
-- Indexes for table `jogador_posição`
--
ALTER TABLE `jogador_posição`
  ADD UNIQUE KEY `uk_jogadorposicao` (`Associado_id`,`tipofutebol_id`,`Preferencia`),
  ADD KEY `pk_jogadorposicao` (`tipofutebol_id`,`jogador_id`,`tipofutebolposicao_id`),
  ADD KEY `fk_jogadorposicao_tipofutebolposical` (`tipofutebolposicao_id`);

--
-- Indexes for table `jogo`
--
ALTER TABLE `jogo`
  ADD PRIMARY KEY (`Jogo_Id`),
  ADD UNIQUE KEY `uk_jogo` (`DtJogo`,`Equipe_Id`,`Equipe_Id_convidada`),
  ADD KEY `fk_Jogo_Equipe1` (`Equipe_Id`),
  ADD KEY `fk_Jogo_Equipe2` (`Equipe_Id_convidada`);

--
-- Indexes for table `operadoras_telefone`
--
ALTER TABLE `operadoras_telefone`
  ADD PRIMARY KEY (`Operadora_id`);

--
-- Indexes for table `paises`
--
ALTER TABLE `paises`
  ADD PRIMARY KEY (`Pais_id`);

--
-- Indexes for table `posicao`
--
ALTER TABLE `posicao`
  ADD KEY `pk_posicao` (`posicao_id`);

--
-- Indexes for table `seguidores`
--
ALTER TABLE `seguidores`
  ADD PRIMARY KEY (`Seguidor_Id`),
  ADD UNIQUE KEY `uk_seguidor` (`associado_Id`,`entidade_Id`,`Equipe_Id`,`Jogador_Id`),
  ADD KEY `fk_seguidor_entidade` (`entidade_Id`),
  ADD KEY `fk_seguidor_equipe` (`Equipe_Id`),
  ADD KEY `fk_seguidor_jogador` (`Jogador_Id`);

--
-- Indexes for table `sexos`
--
ALTER TABLE `sexos`
  ADD PRIMARY KEY (`Sexo_id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tipofutebol_posicao`
--
ALTER TABLE `tipofutebol_posicao`
  ADD KEY `pk_tipofutebolposicao` (`tipofutebolposicao_id`),
  ADD KEY `FK_tipofutebolposicao_tipofutebol` (`tipofutebol_id`),
  ADD KEY `uk_tipofutebolposicao` (`posicao_id`,`tipofutebol_id`);

--
-- Indexes for table `tipos_endereco`
--
ALTER TABLE `tipos_endereco`
  ADD PRIMARY KEY (`Tipoendereco_id`);

--
-- Indexes for table `tipos_entidades`
--
ALTER TABLE `tipos_entidades`
  ADD PRIMARY KEY (`TipoEntidade_id`),
  ADD UNIQUE KEY `UK_Tipos_entidades` (`Descrição`);

--
-- Indexes for table `tipos_evento`
--
ALTER TABLE `tipos_evento`
  ADD PRIMARY KEY (`tipoevento_id`);

--
-- Indexes for table `tipos_futebol`
--
ALTER TABLE `tipos_futebol`
  ADD KEY `pk_tipofutebol` (`tipofutebol_id`);

--
-- Indexes for table `tipos_telefone`
--
ALTER TABLE `tipos_telefone`
  ADD PRIMARY KEY (`Telefone_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `associados`
--
ALTER TABLE `associados`
  MODIFY `Associado_Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primaria do Associado - Número Sequencial',AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `categorias_futebol`
--
ALTER TABLE `categorias_futebol`
  MODIFY `categoria_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'chave primaria',AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `cidades`
--
ALTER TABLE `cidades`
  MODIFY `Cidade_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primaria';
--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `convitejogo_retorno`
--
ALTER TABLE `convitejogo_retorno`
  MODIFY `ConviteRetorno_Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária';
--
-- AUTO_INCREMENT for table `enderecos`
--
ALTER TABLE `enderecos`
  MODIFY `endereco_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária';
--
-- AUTO_INCREMENT for table `entidades`
--
ALTER TABLE `entidades`
  MODIFY `Entidade_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária de Empresa/clube/associação/agremiação';
--
-- AUTO_INCREMENT for table `equipes`
--
ALTER TABLE `equipes`
  MODIFY `equipe_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária';
--
-- AUTO_INCREMENT for table `estados`
--
ALTER TABLE `estados`
  MODIFY `Estado_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave da Tabela Estados',AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `jogadores`
--
ALTER TABLE `jogadores`
  MODIFY `jogador_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária';
--
-- AUTO_INCREMENT for table `jogo`
--
ALTER TABLE `jogo`
  MODIFY `Jogo_Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária';
--
-- AUTO_INCREMENT for table `operadoras_telefone`
--
ALTER TABLE `operadoras_telefone`
  MODIFY `Operadora_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária',AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `paises`
--
ALTER TABLE `paises`
  MODIFY `Pais_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária',AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `posicao`
--
ALTER TABLE `posicao`
  MODIFY `posicao_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária',AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `sexos`
--
ALTER TABLE `sexos`
  MODIFY `Sexo_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'chave primaria',AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tipofutebol_posicao`
--
ALTER TABLE `tipofutebol_posicao`
  MODIFY `tipofutebolposicao_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ChavePrimária',AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `tipos_endereco`
--
ALTER TABLE `tipos_endereco`
  MODIFY `Tipoendereco_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária',AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `tipos_entidades`
--
ALTER TABLE `tipos_entidades`
  MODIFY `TipoEntidade_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária',AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `tipos_evento`
--
ALTER TABLE `tipos_evento`
  MODIFY `tipoevento_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária',AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `tipos_futebol`
--
ALTER TABLE `tipos_futebol`
  MODIFY `tipofutebol_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria',AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `tipos_telefone`
--
ALTER TABLE `tipos_telefone`
  MODIFY `Telefone_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Chave Primária',AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `cidades`
--
ALTER TABLE `cidades`
  ADD CONSTRAINT `fk_cidade_estado` FOREIGN KEY (`Cidade_Estadoid`) REFERENCES `estados` (`Estado_id`);

--
-- Constraints for table `convitejogo`
--
ALTER TABLE `convitejogo`
  ADD CONSTRAINT `fk_Convite_Enderecos` FOREIGN KEY (`EnderecoJogoId`) REFERENCES `enderecos` (`endereco_id`),
  ADD CONSTRAINT `fk_Convite_equipe1` FOREIGN KEY (`Equipe_Id`) REFERENCES `equipes` (`equipe_id`),
  ADD CONSTRAINT `fk_Convite_equipe2` FOREIGN KEY (`EquipeConvidada_Id`) REFERENCES `equipes` (`equipe_id`);

--
-- Constraints for table `convitejogo_retorno`
--
ALTER TABLE `convitejogo_retorno`
  ADD CONSTRAINT `fk_conviteretornojogo_convite` FOREIGN KEY (`Convite_Id`) REFERENCES `convitejogo` (`Convite_Id`);

--
-- Constraints for table `enderecos`
--
ALTER TABLE `enderecos`
  ADD CONSTRAINT `fk_enderecos_associado` FOREIGN KEY (`associado_id`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_enderecos_cidade` FOREIGN KEY (`cidade_id`) REFERENCES `cidades` (`Cidade_id`),
  ADD CONSTRAINT `fk_enderecos_entidade` FOREIGN KEY (`entidade_id`) REFERENCES `entidades` (`Entidade_id`),
  ADD CONSTRAINT `fk_enderecos_tipoendereco` FOREIGN KEY (`tipoendereco_id`) REFERENCES `tipos_endereco` (`Tipoendereco_id`);

--
-- Constraints for table `entidades`
--
ALTER TABLE `entidades`
  ADD CONSTRAINT `fk_entidades_associados1` FOREIGN KEY (`Associado_Id`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_entidades_associados2` FOREIGN KEY (`RespAdministrativo`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_entidades_associados3` FOREIGN KEY (`AuxAdministrativo`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_entidades_tiposentidades` FOREIGN KEY (`TipoEntidade_id`) REFERENCES `tipos_entidades` (`TipoEntidade_id`);

--
-- Constraints for table `equipes`
--
ALTER TABLE `equipes`
  ADD CONSTRAINT `fk_equipes_associados1` FOREIGN KEY (`responsavel_id`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_equipes_associados2` FOREIGN KEY (`administrador_id`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_equipes_categoriafutebol` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_futebol` (`categoria_id`),
  ADD CONSTRAINT `fk_equipes_entidade` FOREIGN KEY (`entidade_id`) REFERENCES `entidades` (`Entidade_id`),
  ADD CONSTRAINT `fk_equipes_tipofutebol` FOREIGN KEY (`tipofutebol_id`) REFERENCES `tipos_futebol` (`tipofutebol_id`);

--
-- Constraints for table `equipes_complemento`
--
ALTER TABLE `equipes_complemento`
  ADD CONSTRAINT `fk_equipescompl_associado1` FOREIGN KEY (`tecnico_id`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_equipescompl_associado2` FOREIGN KEY (`auxiliar_id`) REFERENCES `associados` (`Associado_Id`);

--
-- Constraints for table `equipe_jogadores`
--
ALTER TABLE `equipe_jogadores`
  ADD CONSTRAINT `fk_equipes` FOREIGN KEY (`Equipe_Id`) REFERENCES `equipes` (`equipe_id`),
  ADD CONSTRAINT `fk_jogadores` FOREIGN KEY (`Jogador_Id`) REFERENCES `jogadores` (`jogador_id`),
  ADD CONSTRAINT `fk_posicao1` FOREIGN KEY (`Posicao_id1`) REFERENCES `tipofutebol_posicao` (`tipofutebolposicao_id`),
  ADD CONSTRAINT `fk_posicao2` FOREIGN KEY (`Posicao_id2`) REFERENCES `tipofutebol_posicao` (`tipofutebolposicao_id`),
  ADD CONSTRAINT `fk_posicao3` FOREIGN KEY (`Posicao_id3`) REFERENCES `tipofutebol_posicao` (`tipofutebolposicao_id`);

--
-- Constraints for table `estados`
--
ALTER TABLE `estados`
  ADD CONSTRAINT `fk_estado_paises` FOREIGN KEY (`Pais_id`) REFERENCES `paises` (`Pais_id`);

--
-- Constraints for table `eventos_jogo`
--
ALTER TABLE `eventos_jogo`
  ADD CONSTRAINT `fk_eventojogo_Equipe` FOREIGN KEY (`Equipe_Id`) REFERENCES `equipes` (`equipe_id`),
  ADD CONSTRAINT `fk_eventojogo_jogo` FOREIGN KEY (`Jogo_Id`) REFERENCES `jogo` (`Jogo_Id`),
  ADD CONSTRAINT `fk_eventosJogo_TipoEvento` FOREIGN KEY (`Tipoevento_id`) REFERENCES `tipos_evento` (`tipoevento_id`);

--
-- Constraints for table `jogadores`
--
ALTER TABLE `jogadores`
  ADD CONSTRAINT `fk_jogador_associado` FOREIGN KEY (`associado_id`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_jogador_tipofutebol` FOREIGN KEY (`TipoFutebol_id`) REFERENCES `tipos_futebol` (`tipofutebol_id`);

--
-- Constraints for table `jogador_posição`
--
ALTER TABLE `jogador_posição`
  ADD CONSTRAINT `fk_jogadorposicao_associado` FOREIGN KEY (`Associado_id`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_jogadorposicao_tipofutebol` FOREIGN KEY (`tipofutebol_id`) REFERENCES `tipos_futebol` (`tipofutebol_id`),
  ADD CONSTRAINT `fk_jogadorposicao_tipofutebolposical` FOREIGN KEY (`tipofutebolposicao_id`) REFERENCES `tipofutebol_posicao` (`tipofutebolposicao_id`);

--
-- Constraints for table `jogo`
--
ALTER TABLE `jogo`
  ADD CONSTRAINT `fk_Jogo_Equipe1` FOREIGN KEY (`Equipe_Id`) REFERENCES `equipes` (`equipe_id`),
  ADD CONSTRAINT `fk_Jogo_Equipe2` FOREIGN KEY (`Equipe_Id_convidada`) REFERENCES `equipes` (`equipe_id`);

--
-- Constraints for table `seguidores`
--
ALTER TABLE `seguidores`
  ADD CONSTRAINT `fk_seguidor_associado` FOREIGN KEY (`associado_Id`) REFERENCES `associados` (`Associado_Id`),
  ADD CONSTRAINT `fk_seguidor_entidade` FOREIGN KEY (`entidade_Id`) REFERENCES `entidades` (`Entidade_id`),
  ADD CONSTRAINT `fk_seguidor_equipe` FOREIGN KEY (`Equipe_Id`) REFERENCES `equipes` (`equipe_id`),
  ADD CONSTRAINT `fk_seguidor_jogador` FOREIGN KEY (`Jogador_Id`) REFERENCES `jogadores` (`jogador_id`);

--
-- Constraints for table `tipofutebol_posicao`
--
ALTER TABLE `tipofutebol_posicao`
  ADD CONSTRAINT `FK_tipofutebolposicao_tipofutebol` FOREIGN KEY (`tipofutebol_id`) REFERENCES `tipos_futebol` (`tipofutebol_id`),
  ADD CONSTRAINT `fk_tipofutebolposicao_posicao` FOREIGN KEY (`posicao_id`) REFERENCES `posicao` (`posicao_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
