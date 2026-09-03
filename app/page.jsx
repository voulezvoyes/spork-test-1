  const send = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      role: "user",
      content: input.trim()
    };

    const newMsgs = [...msgs, userMsg];

    setBranches(p => ({
      ...p,
      [activeId]: {
        ...p[activeId],
        messages: newMsgs
      }
    }));

    const userText = input.trim();

    setInput("");

    if (taRef.current) {
      taRef.current.style.height = "auto";
    }

    setLoading(true);

    await new Promise(r => setTimeout(r, 700));

    let reply = "";
    const t = userText.toLowerCase();

    // 구체적인 branch 요청을 먼저 검사해야 함

    if (
      t.includes("저예산") ||
      t.includes("budget") ||
      t.includes("cheap")
    ) {

      reply =
        "좋아. 같은 LA 3일 일정의 맥락은 유지하되 저예산 버전으로 갈라볼게. " +
        "숙소는 Metro 접근성이 좋은 Koreatown이나 Downtown 쪽을 우선 보고, " +
        "이동은 Metro와 버스를 중심으로 잡아. " +
        "Griffith Observatory, The Broad, Venice Beach처럼 무료 또는 저비용 명소를 넣고, " +
        "식사는 타코 트럭·푸드코트·로컬 카페 위주로 구성하면 하루 지출을 크게 낮출 수 있어. " +
        "원하면 이 브랜치에서 하루별 예상 예산까지 계산해볼 수 있어.";

    } else if (
      t.includes("럭셔리") ||
      t.includes("luxury") ||
      t.includes("고급")
    ) {

      reply =
        "좋아. 원래 LA 3일 일정에서 이번 브랜치는 럭셔리 버전으로 발전시켜볼게. " +
        "숙소는 West Hollywood나 Beverly Hills의 상급 호텔, " +
        "이동은 rideshare나 전용 차량을 기준으로 하고, " +
        "식사는 예약이 필요한 레스토랑과 칵테일 바를 넣자. " +
        "일정도 관광지를 많이 찍기보다 Getty, Malibu, West Hollywood처럼 " +
        "한 지역에서 오래 머무는 경험 중심으로 느슨하게 구성하는 편이 맞아. " +
        "원하면 이 브랜치에서 호텔·식당까지 구체화해볼 수 있어.";

    } else if (
      t.includes("la") ||
      t.includes("los angeles") ||
      t.includes("여행")
    ) {

      reply =
        "좋아. LA 3일 여행이라면 먼저 방향을 잡아볼 수 있어. " +
        "Day 1은 Downtown과 Arts District, " +
        "Day 2는 Santa Monica와 Venice, " +
        "Day 3는 Griffith Observatory와 Los Feliz를 중심으로 구성해볼게. " +
        "여기서 예산, 음식, 이동 방식, 분위기에 따라 서로 다른 방향으로 더 깊게 발전시킬 수 있어.";

    } else if (
      t.includes("이름") ||
      t.includes("name")
    ) {

      reply =
        "가능성을 여러 방향으로 탐색해보자. " +
        "기능 중심 이름, 감성적인 이름, 기술적인 이름처럼 서로 다른 방향을 만들 수 있어. " +
        "마음에 드는 지점에서 branch를 만들어 각각 발전시켜봐.";

    } else {

      reply =
        "이 아이디어에는 몇 가지 서로 다른 방향이 있어. " +
        "지금 답변의 특정 지점에서 다른 가능성을 따로 탐색하고 싶다면 " +
        "그 지점에서 새 branch를 만들어 이어갈 수 있어.";

    }

    setBranches(p => ({
      ...p,
      [activeId]: {
        ...p[activeId],
        messages: [
          ...newMsgs,
          {
            role: "assistant",
            content: reply
          }
        ]
      }
    }));

    setLoading(false);

  }, [input, loading, msgs, activeId]);
