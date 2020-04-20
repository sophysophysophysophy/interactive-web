// 전역변수 회피를 위하여 즉시실행 함수 안에 대부분의 변수 선언하기
(() => {
    // stage를 마우스무브에 맞춰 시점 이동 가능하게 할 것. ( 그래야 일분이들 객체도 이동 가능)
    const stageElem = document.querySelector('.stage')
    // house를 이동시켜 앞뒤로 공간 움직이게 할 것
    const houseElem = document.querySelector('.house')
    const barElem = document.querySelector('.progress-bar')
    const mousePos = {x : 0, y : 0}
    const selectCharacterElem = document.querySelector('.select-character')

    // 창 크기에 따라서 스크롤 값 변경됨. 문서 전체 높이 (body의 높이) - 스크롤바 길이 : 스크롤 되는 범위 구할 수 있음 
    // 선언
    let maxScrollValue = 0 

    resizeHandler = () => {
        maxScrollValue = document.body.offsetHeight - window.innerHeight
    }

    window.addEventListener('scroll', () => {
        // 스크롤한 값 : pageYOffset으로 확인 가능 
        // console.log(pageYOffset);

        // 창 크기에 따라서 스크롤 값 변경됨. 문서 전체 높이 (body의 높이) - 스크롤바 길이 : 스크롤 되는 범위 구할 수 있음 
        // console.log(maxScrollValue);

        // 비율로 정확히 계산 가능 : pageYOffset과 maxScrollValue
        // 처음 시작은 0 ,맨 밑으로 내리면 1
        // 맨 밑에서는 서로의 값이 같아지기 때문 ( pageYOffset은 0부터 창 맨 밑까지 길이 커지기 때문)
        // console.log(pageYOffset / maxScrollValue);
        // console.log(pageYOffset);
    

        // 비율이라 소수점 밑까지 내려가기 때문에 살피기 쉽게 1000을 곱해 자연수로 처리해줌
        // 첫 화면의 house default가 -490 되어 '안녕하세요'가 적절한 위치에 오게 해주었기 때문에
        // 여기서도 첫 화면과 자연스러운 translate으로 위하여 490빼고 시작 ( 안하면 스크롤 하자마자 0 되면서 자연스럽지 않음)

        // 1000을 곱하는 것이 아니라 950을 곱함으로써 맨 마지막 곤니찌와까지 왔을 때 곤니찌와 벽만 나오는 것이 아니라 사방까지 더 나올 수 있게 처리해줌 
        const scrollPer = pageYOffset / maxScrollValue
        const zMove = scrollPer * 950 - 490
        houseElem.style.transform = 'translateZ(' + zMove + 'vw)'



        // progress bar 기능
        barElem.style.width = scrollPer * 100 + '%'
        })
    

    //마우스 이동시 3D 공간 시점 변경 
    window.addEventListener('mousemove', (e) => {
        // 원점이 가운데여야 컨트롤하기 쉬움
        mousePos.x = -1 + (e.clientX / window.innerWidth) * 2 
        mousePos.y = 1 - (e.clientY / window.innerHeight) * 2 
        stageElem.style.transform = 'rotateX('+ (mousePos.y * 5)  + 'deg) rotateY('+ (mousePos.x * 5) +'deg)'
    })
    //윈도우 사이즈가 변경될 때 일어나는 이벤트
    window.addEventListener('resize', resizeHandler);


    //stageElem 클릭 이벤트를 걸어서 그 위치에 일분이 붙이기 
    stageElem.addEventListener('click', (e) => {
        //%를 이용하여 left 값 조정 가능 
        // console.log(e.clientX / window.innerWidth * 100)
        // 객체를 param으로 넣어줌 
        // 생성자에 넣지 않고 객체로 넣어주는 이유는 다양한 프로퍼티가 추가될 예정이기 떄문
        // 따라서 character는 하나의 매개변수를 받되, 그 안에서 프로퍼티만 추가하여 사용할 수 있게 됨
    
        new Character({
            xPos: e.clientX / window.innerWidth * 100,

            // 각 인스턴스 객체 스피트 랜덤하게 작성
            // 소수값 랜덤하게 리턴 : Math.random 
            // * 0.5를 곱하여 더 느리게, + 0.2를 하여 좀 스피드 업
            // 이런식으로 값과 스피드 조절함
            speed : Math.random() * 0.5 + 0.2
        })
    })

    selectCharacterElem.addEventListener('click', (e) => {
        // console.log(e.target.getAttribute('data-char'));
        const value = e.target.getAttribute('data-char')
        document.body.setAttribute('data-char', value)
    })
    //문서 로드시 핸들러로 value 초기화
    resizeHandler()

    // 생성자로 객체 붙여넣음
    // new Character()


})()