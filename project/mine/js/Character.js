// class이기 때문에 대문자로 객체명 지음. 
// 생성자
 function Character (info) {
    // this로 했다는 것 : character 생성자로 만들어낸 인스턴트 객체의 속성으로 사용하겠다는 의미
    this.mainElem = document.createElement('div')
    this.mainElem.classList.add('character')

    // ES6에서는 이렇게 연결 안해도 `를 이용하여 넣을 수 있다! 
    this.mainElem.innerHTML = ''
    + '<div class="character-face-con character-head">'
        + '<div class="character-face character-head-face face-front"></div>'
        + '<div class="character-face character-head-face face-back"></div>'
    + '</div>'
    + '<div class="character-face-con character-torso">'
        + '<div class="character-face character-torso-face face-front"></div>'
        + '<div class="character-face character-torso-face face-back"></div>'
    + '</div>'
    + '<div class="character-face-con character-arm character-arm-right">'
        + '<div class="character-face character-arm-face face-front"></div>'
        + '<div class="character-face character-arm-face face-back"></div>'
    + '</div>'
    + '<div class="character-face-con character-arm character-arm-left">'
        + '<div class="character-face character-arm-face face-front"></div>'
        + '<div class="character-face character-arm-face face-back"></div>'
    + '</div>'
    + '<div class="character-face-con character-leg character-leg-right">'
        + '<div class="character-face character-leg-face face-front"></div>'
        + '<div class="character-face character-leg-face face-back"></div>'
    + '</div>'
    + '<div class="character-face-con character-leg character-leg-left">'
        + '<div class="character-face character-leg-face face-front"></div>'
        + '<div class="character-face character-leg-face face-back"></div>'
    + '</div>'
    document.querySelector('.stage').appendChild(this.mainElem)
    
    // 위치 지정해주기위하여 파라미터의 프로퍼티 이용
    // 퍼센트를 이용하여 left값 조정 
    this.mainElem.style.left = info.xPos + '%'

    //스크롤 중인지 아닌지 체크하는 변수
    this.scrollState = false
    
    //바로 이전(마지막) 스크롤 위치
    this.lastScrollTop = 0

    this.xPos = info.xPos
    // 속도 프로퍼티 작성
    this.speed = info.speed

    //좌우 이동 중인지 아닌지 
    this.runningState = false
    this.rafId 
    this.direction
    //prototype에 접근하여 init함수 실행
    this.init()

    
}

//상황에 따라 class 넣고 빼고 하는 것은 함수 === 메소드 ( 캐릭터 객체의 메소드)
// 모든 인스턴스에서 사용하는 메소드이기 때문에 prototype으로 메소드 생성
// 생성자 방법 : constructor: 생성자명 (프로토타입 객체 재설정,다시 정의 )  , prototype.생성자명 (프로토타입 객체에 새로 생성자 추가)
Character.prototype = {
    constructor: Character,
    
    //초기화 함수
    init: function() {
        // es6 이전 문법에서는 상위 객체에 접근할 변수 필요
        // const self = this
        window.addEventListener('scroll', () => {
        
            //scrollState에 들어오는 숫자를 clear, 취소해주는 것
            // 스크롤이 일어나자 마자 무조건 clear 해버림
            // 처음에는 scroll하자마자 add 됨
            // 그 후 setTimeout 실행이 됨. 
            // 하지만 스크롤을 하는 도중에는 clearTimeout이 계속 실행됨
            // 따라서 setTimeout은 실행되지 못함 
            // scroll이 멈추고 나면 clearTimeout이 실행되지 않기 때문에
            // 그 마지막 턴에서야, 그제서야 0.5초 이후 실행되는 setTimeout이 실행됨

            //0.5초가 되기 전에 스크롤은 계속 일어나고. 스크롤이 일어날 때마다 clearTimeout이 
            // 실행되기 때문에 setTimeout이 실행되지 못함.
            // 그러다가 마지막에 scroll이 멈추면 clearTimeout이 실행되지 않기 때문에
            // setTimeout이 실행되고 running이 remove되어 멈추게 됨

            // clearTimeout - setTimeout은 세트!

            clearTimeout(this.scrollState)

            // scrollstate가 false일 때
            //running class 붙여줌 
            if(!this.scrollState) {
                this.mainElem.classList.add('running')
            }
            
            //setTimeout : 0.5초 후에 이 함수 실행됨 (바로 실행 아니라)
            // scrollState를 false로 변경하고 running을 없앤다
            // ==> 멈추게 하는 코드 
            // setTimeout은 어떤 값을 리턴을 해줌. => 그 값을 scrollState에 넣어줌
            // setTimeout은 숫자 리턴 ==> 그러면 scrollState은 true
            // 0.5초 후에는 scrollState = false로 세팅해줌
            this.scrollState = setTimeout(() => {
                this.scrollState = false
                this.mainElem.classList.remove('running')
            }, 500)


            // 스크롤 올리는지 내리는지 check 방법 ; pageYoffset
            // 이전 스크롤 위치와 현재 스크롤 위치를 비교
            if(this.lastScrollTop > pageYOffset) {
                // 이전 스크롤 위치가 크다면 : 스크롤 업 
                this.mainElem.setAttribute('data-direction', 'back')
            } else {
                // 이전 스크롤 위치가 작다면 : 스크롤 다운
                this.mainElem.setAttribute('data-direction', 'forward')
            }

            // 마지막으로 스크롤한 위치가 저장이 된 것이니까 다음 턴 스크롤 이벤트가 일어날 때 이전 값 차이 가지고 위아래 분기
            this.lastScrollTop = pageYOffset
            
        })

        window.addEventListener('keydown', (e) => {

            //갑자기 빨라지는 이슈 : requestAnimation 중첩이 계속 진행돼서
            // 따라서 이동중일 때 이벤트 발생 시키면 안됨
            if(this.runningState) return 

            // 이벤트 객체의 고유 값이 있어서 무슨 키 눌렀는지 확인 가능
            // keycode.info 라는 사이트에서 키코드 다 알려줌~
            // console.log(e.keyCode);

            // 키다운 이벤트에 의존하기에는 너무 느림
            // 프레임이 너무 작아서 좋지 않음 -> requestAnimation !
            if(e.keyCode === 37) {
                // 왼쪽
                this.direction = 'left'
                this.mainElem.setAttribute('data-direction', 'left')
                this.mainElem.classList.add('running')
                // x축 포지션을 스피드만큼 빼서 이동시킴
                // this.xPos -= this.speed
                // this.mainElem.style.left = this.xPos + '%'

                this.run(this)
                this.runningState = true
            } else if(e.keyCode === 39) {
                // 오른쪽
                this.direction = 'right'
                this.mainElem.setAttribute('data-direction', 'right')
                this.mainElem.classList.add('running')
                this.run(this)
                this.runningState = true
            }
        })

        window.addEventListener('keyup', (e) => {
            this.mainElem.classList.remove('running')
            this.runningState = false

            //재귀적으로 실행되던 requestAni 끝냄
            cancelAnimationFrame(this.rafId)
        })
    },
    run(self) {
        // console.log(self.xPos);

        this.mainElem.xPos
        if(this.direction === 'left') {
            this.xPos -= this.speed
        } else if(this.direction === 'right') {
            this.xPos += this.speed
        }

        // 벽 뚫고 지나가는것 해결
        if(self.xPos < 2) {
            self.xPos = 2
        }else if(self.xPos > 88) {
            self.xPos = 88
        }

        //requestAnimation의 context가 두번째부터 window로 변경되어서
        // 처음엔 잘 가리키다가 this가 객체가 아닌 window 전역 객체를 가리키게 됨.
        this.mainElem.style.left = this.xPos +'%'

        this.rafId = requestAnimationFrame(() => {
            this.run(self)
        })
    }
}