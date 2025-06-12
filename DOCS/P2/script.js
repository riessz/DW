// Funções básicas para navegação entre slides
let currentSlide = 1;
const totalSlides = 7;

// Objeto para armazenar as respostas do usuário
let quizAnswers = {
    knowledge: null,
    goal: null,
    time: null,
    value: null
};

function showSlide(n) {
    // Esconde todos os slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active-slide');
    });

    // Mostra o slide atual
    document.getElementById(`slide-${n}`).classList.add('active-slide');

    // Atualiza a barra de progresso
    const progress = ((n - 1) / (totalSlides - 1)) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;

    // Atualiza os passos ativos
    document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
        if (index < n) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}
// Função para avançar para o próximo slide
function nextSlide() {
    const current = document.getElementById(`slide-${currentSlide}`);
    const requiredRadios = current.querySelectorAll('input[type="radio"][required]');
    const requiredCheckboxes = current.querySelectorAll('input[type="checkbox"][required]');
    const requiredText = current.querySelectorAll('input[type="text"][required], input[type="number"][required]');
    let valid = true;
    let errorMsgText = 'Por favor, preencha todos os campos obrigatórios.';

    // Validação para radio
    if (requiredRadios.length > 0) {
        valid = Array.from(requiredRadios).some(radio => radio.checked);
    }
    // Validação para checkbox
    if (requiredCheckboxes.length > 0) {
        valid = Array.from(requiredCheckboxes).some(checkbox => checkbox.checked);
    }
    // Validação para campos de texto/número obrigatórios
    requiredText.forEach(input => {
        if (input.value.trim() === '') valid = false;
        // Validação especial para slide 5 (valor a investir)
        if (currentSlide === 5 && input.classList.contains('dinheiro')) {
            if (!/^\d+$/.test(input.value.trim())) {
                valid = false;
                errorMsgText = 'Insira um valor válido.';
            } else if (parseInt(input.value.trim(), 10) < 2500) {
                valid = false;
                errorMsgText = 'O valor mínimo para investir é R$ 2500.';
            }
        }
    });

    // Validação especial para slide 6 (formulário de contato)
    if (currentSlide === 6) {
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const phone = document.getElementById('user-phone').value.trim();

        // Nome: apenas letras e espaços, pelo menos 2 palavras, sem números
        if (!/^[A-Za-zÀ-ÿ\s]{3,}$/.test(name) || /\d/.test(name) || name.split(' ').length < 2) {
            valid = false;
            errorMsgText = 'Digite um nome válido.';
        }
        // Email: validação básica
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            valid = false;
            errorMsgText = 'Digite um e-mail válido.';
        }
        // Telefone: apenas números, 11 dígitos (formato brasileiro)
        else if (!/^\d{11}$/.test(phone.replace(/\D/g, ''))) {
            valid = false;
            errorMsgText = 'Digite um telefone válido com DDD e apenas números (ex: 11999999999).';
        }
    }

    // Mensagem de erro visual
    document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');
    const errorMsg = current.querySelector('.error-message');
    if (!valid) {
        if (errorMsg) {
            errorMsg.textContent = errorMsgText;
            errorMsg.style.display = 'block';
        }
        return;
    } else {
        if (errorMsg) errorMsg.style.display = 'none';
    }

    // Salva as respostas ANTES de avançar o slide
    if (currentSlide === 2) {
        const checked = current.querySelector('input[name="knowledge"]:checked');
        if (checked) quizAnswers.knowledge = checked.value;
    }
    if (currentSlide === 3) {
        const checked = current.querySelector('input[name="goal"]:checked');
        if (checked) quizAnswers.goal = checked.value;
    }
    if (currentSlide === 4) {
        const checked = current.querySelector('input[name="time"]:checked');
        if (checked) quizAnswers.time = checked.value;
    }
    if (currentSlide === 5) {
        const input = current.querySelector('.dinheiro');
        if (input) quizAnswers.value = parseInt(input.value.trim(), 10);
    }
    if (currentSlide === 6) {
        quizAnswers.name = document.getElementById('user-name').value.trim();
        quizAnswers.email = document.getElementById('user-email').value.trim();
        quizAnswers.phone = document.getElementById('user-phone').value.trim();
    }

    // Agora avance o slide
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);

        // Se for o slide de resultado, calcula o perfil
        if (currentSlide === 7) {
            const profileType = document.getElementById('profile-type');
            const profileDescription = document.getElementById('profile-description');

            let perfil = '';
            let descricao = '';

            if (quizAnswers.knowledge === 'beginner' || quizAnswers.goal === 'protection' || quizAnswers.time === 'short') {
                perfil = 'Conservador';
                descricao = 'Você prefere segurança e liquidez, evitando riscos. Invista em renda fixa, CDBs e Tesouro Direto.';
            } else if (quizAnswers.knowledge === 'advanced' && quizAnswers.goal === 'growth' && quizAnswers.time === 'long') {
                perfil = 'Arrojado';
                descricao = 'Você busca alto retorno e aceita riscos maiores. Considere ações, ETFs e fundos multimercado.';
            } else {
                perfil = 'Moderado';
                descricao = 'Você aceita algum risco em busca de melhores retornos, mas ainda valoriza certa segurança.';
            }

            if (profileType) profileType.innerHTML = `<h3>${perfil}</h3>`;
            if (profileDescription) profileDescription.innerHTML = `<p>${descricao}</p>`;
            renderProfileChart(perfil); // Renderiza o gráfico com base no perfil
        }
    }
}
// Função para voltar ao slide anterior
function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}
// Função para reiniciar o questionário
function restartQuiz() {
    quizAnswers = {
        knowledge: null,
        goal: null,
        time: null,
        value: null
    };
    currentSlide = 1;
    showSlide(currentSlide);
    /* Limpa os inputs do questionário */
    document.querySelectorAll('.slide input').forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
        } else if (input.type === 'text' || input.type === 'number' || input.tagName === 'TEXTAREA') {
            input.value = '';
        }
    });
}


// Navegação entre seções
document.getElementById('home-link').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('questionario-section').classList.remove('hidden');
    document.getElementById('economic-data-section').classList.add('hidden');
    document.getElementById('investments-section').classList.add('hidden');
    this.classList.add('active');
    document.getElementById('economic-data-link').classList.remove('active');
    document.getElementById('investments-link').classList.remove('active');
});

document.getElementById('economic-data-link').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('questionario-section').classList.add('hidden');
    document.getElementById('economic-data-section').classList.remove('hidden');
    document.getElementById('investments-section').classList.add('hidden');
    this.classList.add('active');
    document.getElementById('home-link').classList.remove('active');
    document.getElementById('investments-link').classList.remove('active');
    fetchEconomicData(); // Chama a função para buscar dados econômicos
    renderEconomicChart(); // Renderiza o gráfico com os dados econômicos
});

document.getElementById('investments-link').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('questionario-section').classList.add('hidden');
    document.getElementById('economic-data-section').classList.add('hidden');
    document.getElementById('investments-section').classList.remove('hidden');
    this.classList.add('active');
    document.getElementById('home-link').classList.remove('active');
    document.getElementById('economic-data-link').classList.remove('active');
    fetchInvestmentsData(); // Chama a função para buscar dados de investimentos
renderInvestmentsChart(); // Renderiza o gráfico com os dados de investimentos
});

// Menu mobile
document.getElementById('mobile-menu-btn').addEventListener('click', function () {
    document.querySelector('.nav').classList.toggle('active');
});

// Função para buscar dados econômicos e renderizar o gráfico
async function fetchEconomicData() {
    const url = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL';
    try {
        const response = await fetch(url);
        const data = await response.json();

        const tbody = document.querySelector('#economic-data-table tbody');
        tbody.innerHTML = '';
        Object.values(data).forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.create_date.split(' ')[0]}</td>
                <td>${item.code}</td>
                <td>R$ ${parseFloat(item.bid).toFixed(2)}</td>
                <td>${parseFloat(item.pctChange).toFixed(2)}%</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Erro ao buscar dados econômicos:', err);
    }
}
// Função para renderizar o gráfico de dados econômicos
async function renderEconomicChart() {
    const url = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL';
    try {
        const response = await fetch(url);
        const data = await response.json();

        const labels = Object.values(data).map(item => item.code);
        const values = Object.values(data).map(item => parseFloat(item.bid));
        const colors = ['#27ae60', '#2980b9', '#f39c12'];

        const ctx = document.getElementById('economic-api-chart').getContext('2d');
        if (window.economicApiChartInstance) {
            window.economicApiChartInstance.destroy();
        }
        window.economicApiChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cotação (R$)',
                    data: values,
                    backgroundColor: colors
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                }
            }
        });
    } catch (err) {
        console.error('Erro ao buscar dados para o gráfico:', err);
    }
}

// Função para renderizar o gráfico de investimentos
async function renderInvestmentsChart() {
    const url = 'https://brasilapi.com.br/api/banks/v1';
    try {
        const response = await fetch(url);
        const data = await response.json();

        const labels = data.slice(0, 5).map(bank => bank.name);
        const values = data.slice(0, 5).map(bank => bank.code);

        const ctx = document.getElementById('investments-chart').getContext('2d');
        if (window.investmentsChartInstance) {
            window.investmentsChartInstance.destroy();
        }
        window.investmentsChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Código do Banco',
                    data: values,
                    backgroundColor: '#2980b9'
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                }
            }
        });
    } catch (err) {
        console.error('Erro ao buscar dados para o gráfico de investimentos:', err);
    }
}
async function fetchInvestmentsData() {
    const url = 'https://brasilapi.com.br/api/banks/v1';
    try {
        const response = await fetch(url);
        const data = await response.json();

        const tbody = document.querySelector('#investments-table tbody');
        tbody.innerHTML = '';
        // Mostra só os 5 primeiros bancos para exemplo
        data.slice(0, 5).forEach(bank => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${bank.name}</td>
                <td>Banco</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${bank.code}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Erro ao buscar dados de investimentos:', err);
    }
}

// Função para renderizar o gráfico de perfil de investimentos
function renderProfileChart(perfil) {
    let labels = [];
    let values = [];
    let colors = [];

    if (perfil === 'Conservador') {
        labels = ['Tesouro Selic', 'CDB 110% CDI', 'Poupança'];
        values = [13.15, 12.5, 8.0];
        colors = ['#27ae60', '#2980b9', '#f1c40f'];
    } else if (perfil === 'Moderado') {
        labels = ['Tesouro IPCA+', 'ETF BOVA11', 'CDB 110% CDI'];
        values = [15.2, 18.2, 12.5];
        colors = ['#27ae60', '#8e44ad', '#2980b9'];
    } else if (perfil === 'Arrojado') {
        labels = ['ETF BOVA11', 'Ações', 'Bitcoin'];
        values = [18.2, 25.0, 120.0];
        colors = ['#8e44ad', '#e74c3c', '#f39c12'];
    }
// Renderiza o gráfico com os dados do perfil
    const ctx = document.getElementById('economic-chart').getContext('2d');
    if (window.economicChartInstance) {
        window.economicChartInstance.destroy();
    }
    window.economicChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rentabilidade 12 meses (%)',
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    showSlide(1);

});