// class Apito{
//     constructor(velocidaeInicial){
//         this.velocidade=velocidaeInicial
//         this.setVelocidade(this.velocidade)

//     }
//     acelerar(){
//         var velocidadeAtual=this.getVelocidade()
//         console.log("Velocidade antes de alterar: " +velocidadeAtual)
//         setVelocidade(velocidadeAtual+0.2)
//     }
//     getVelocidade(){
//         return velocidade;
//     }
//     setVelocidade(valor){
//         console.log("setouVelocidade")
//         this.velocidadeAtual=valor
//     }
//     iniciarJogo(){
//         new FlappyBird().start()
//     }    
// }


function newElement(tagName, className){

    const element = document.createElement(tagName)
    element.className =  className
    return element
}

function Barreira(reversa = false){
    this.elemento = newElement('div', 'barreira')

    const borda = newElement('div', 'borda')
    const corpo = newElement('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const b = new Barreira(true)
// b.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function ParDeBarreiras(altura, abertura, x){
    this.elemento = newElement('div', 'barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * ( altura - abertura )
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)                
        this.inferior.setAltura(alturaInferior)                
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth
    
    this.sortearAbertura()
    this.setX(x)
}

// const b = new ParDeBarreiras(700, 200, 800)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, distancia, notificarPonto){

    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + distancia),
        new ParDeBarreiras(altura, abertura, largura + distancia * 2),
        new ParDeBarreiras(altura, abertura, largura + distancia * 3)
    ]
    const deslocamento=10
    this.animar = () => {
        this.pares.forEach( par => {
            par.setX(par.getX() - deslocamento)

            if(par.getX() < -par.getLargura()) {
                par.setX( par.getX() + distancia * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if(cruzouOMeio) notificarPonto()
        })
    }
}

function Passaro(alturaJogo){
    const apitoVivo= 'imgs/lilpito.png'
    let voando = false
    this.elemento = newElement('img', 'passaro')
    this.elemento.src = apitoVivo

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if( novoY <= 0 ) {
            this.setY(0)
        } else if ( novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}

function Progresso(){
    this.elemento = newElement('span', 'score-class')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras){
    let colidiu = false
    barreiras.pares.forEach(ParDeBarreiras => {
        if(!colidiu) {
            const superior = ParDeBarreiras.superior.elemento
            const inferior = ParDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}

function FlappyBird(){
    
    let pontos = 0
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const score = document.querySelector('[score]')

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atualizarPontos(++pontos))
    
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    score.appendChild(progresso.elemento)
    barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento))
    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            if(colidiu(passaro, barreiras)) {
                const apitoMorto='imgs/apito.png'
                var elemento=document.getElementsByClassName("passaro")
                elemento.src=apitoMorto
                console.log("morreu")
                console.log(elemento)
                clearInterval(temporizador)
            }
        }, 20)
    }
}

new FlappyBird().start()

//const ApitinhoFofinho=new Apito(3)
//ApitinhoFofinho.iniciarJogo()


