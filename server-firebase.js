import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db, auth, testConnection } from './config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

async function inicializarServidor() {
    try {
        const conexaoOk = await testConnection();
        if (!conexaoOk) {
            console.error('❌ Não foi possível conectar ao Firebase');
            process.exit(1);
        }
        console.log('✅ Firebase conectado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: 'Firebase Firestore',
        version: '2.0.0'
    });
});

app.post('/cadastrar', async (req, res) => {
    try {
        const { nome, tipo, email, senha, telefone, cidade, estado, cep, cpf_cnpj, descricao, area_atuacao, especialidades, portfolio_url } = req.body;
        
        if (!nome || !tipo || !email || !senha) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Nome, tipo, email e senha são obrigatórios' 
            });
        }

        if (!['cliente', 'empresa', 'freelancer'].includes(tipo)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Tipo de usuário inválido' 
            });
        }

        const emailRegex = /^[\S]+@[\S]+\.[\S]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Formato de email inválido' 
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'A senha deve ter pelo menos 6 caracteres' 
            });
        }

        const userRecord = await auth.createUser({
            email: email,
            password: senha,
            displayName: nome,
            disabled: false
        });

        await db.collection('usuarios').doc(userRecord.uid).set({
            nome,
            email,
            tipo,
            telefone: telefone || null,
            cidade: cidade || null,
            estado: estado || null,
            cep: cep || null,
            cpf_cnpj: cpf_cnpj || null,
            descricao: descricao || null,
            area_atuacao: area_atuacao || null,
            especialidades: Array.isArray(especialidades) ? especialidades : [],
            portfolio_url: portfolio_url || null,
            foto_perfil: null,
            ativo: true,
            data_cadastro: FieldValue.serverTimestamp(),
            data_atualizacao: FieldValue.serverTimestamp()
        });

        const usuario = {
            id: userRecord.uid,
            nome,
            email,
            tipo,
            telefone,
            cidade,
            ativo: true
        };

        res.status(201).json({ 
            status: 'ok', 
            message: 'Usuário cadastrado com sucesso',
            usuario 
        });

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Email já cadastrado' 
            });
        }
        
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro ao cadastrar usuário',
            error: error.message 
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Email e senha são obrigatórios' 
            });
        }

        const userRecord = await auth.getUserByEmail(email);
        
        const docRef = await db.collection('usuarios').doc(userRecord.uid).get();
        
        if (!docRef.exists) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Usuário não encontrado' 
            });
        }

        const userData = docRef.data();

        if (!userData.ativo) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Usuário desativado' 
            });
        }

        res.json({ 
            status: 'ok', 
            message: 'Login realizado com sucesso',
            usuario: {
                id: userRecord.uid,
                nome: userData.nome,
                email: userData.email,
                tipo: userData.tipo
            },
            note: 'Para autenticação completa, use Firebase Client SDK no frontend'
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        
        if (error.code === 'auth/user-not-found') {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Email ou senha incorretos' 
            });
        }
        
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro ao fazer login',
            error: error.message 
        });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const { limite = 50, tipo, cidade } = req.query;
        
        let query = db.collection('usuarios');
        
        if (tipo) {
            query = query.where('tipo', '==', tipo);
        }
        
        if (cidade) {
            query = query.where('cidade', '==', cidade);
        }
        
        query = query.where('ativo', '==', true)
                     .orderBy('data_cadastro', 'desc')
                     .limit(parseInt(limite));
        
        const snapshot = await query.get();
        
        const usuarios = [];
        snapshot.forEach(doc => {
            usuarios.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json(usuarios);

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro ao listar usuários',
            error: error.message 
        });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const doc = await db.collection('usuarios').doc(id).get();
        
        if (!doc.exists) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Usuário não encontrado' 
            });
        }

        res.json({
            id: doc.id,
            ...doc.data()
        });

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro ao buscar usuário',
            error: error.message 
        });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        delete dados.id;
        delete dados.email;
        delete dados.data_cadastro;

        await db.collection('usuarios').doc(id).update({
            ...dados,
            data_atualizacao: FieldValue.serverTimestamp()
        });

        const docAtualizado = await db.collection('usuarios').doc(id).get();

        res.json({ 
            status: 'ok', 
            message: 'Usuário atualizado com sucesso',
            usuario: {
                id: docAtualizado.id,
                ...docAtualizado.data()
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro ao atualizar usuário',
            error: error.message 
        });
    }
});

app.post('/usuarios/:id/alterar-senha', async (req, res) => {
    try {
        const { id } = req.params;
        const { novaSenha } = req.body;

        if (!novaSenha) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Nova senha é obrigatória' 
            });
        }

        if (novaSenha.length < 6) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'A senha deve ter pelo menos 6 caracteres' 
            });
        }

        await auth.updateUser(id, {
            password: novaSenha
        });

        res.json({ 
            status: 'ok', 
            message: 'Senha alterada com sucesso' 
        });

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro ao alterar senha',
            error: error.message 
        });
    }
});

app.get('/estatisticas', async (req, res) => {
    try {
        const snapshot = await db.collection('usuarios').get();
        
        let total = 0;
        let porTipo = {
            cliente: { total: 0, ativos: 0 },
            empresa: { total: 0, ativos: 0 },
            freelancer: { total: 0, ativos: 0 }
        };

        snapshot.forEach(doc => {
            const data = doc.data();
            total++;
            
            if (porTipo[data.tipo]) {
                porTipo[data.tipo].total++;
                if (data.ativo) {
                    porTipo[data.tipo].ativos++;
                }
            }
        });

        res.json({
            total_usuarios: total,
            por_tipo: porTipo
        });

    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro ao buscar estatísticas',
            error: error.message 
        });
    }
});

inicializarServidor().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Node.js com Firebase rodando em http://localhost:${PORT}`);
        console.log(`📋 Endpoints disponíveis:`);
        console.log(`  GET  /health - Status do servidor`);
        console.log(`  POST /cadastrar - Cadastrar novo usuário`);
        console.log(`  POST /login - Fazer login`);
        console.log(`  GET  /usuarios - Listar usuários`);
        console.log(`  GET  /usuarios?tipo=freelancer - Listar usuários por tipo`);
        console.log(`  GET  /usuarios/:id - Buscar usuário por ID`);
        console.log(`  PUT  /usuarios/:id - Atualizar usuário`);
        console.log(`  POST /usuarios/:id/alterar-senha - Alterar senha`);
        console.log(`  GET  /estatisticas - Estatísticas do sistema`);
        console.log(`💾 Banco de dados: Firebase Firestore`);
        console.log(`🔐 Autenticação: Firebase Authentication`);
    });
});

process.on('SIGINT', () => {
    console.log('\n🔄 Encerrando servidor...');
    process.exit(0);
});

export default app;

