const isHindi = true;
const topic = "test";
      disclaimer: 'Income projections are estimates only and not guaranteed. Actual results depend on market conditions, effort, and execution.',
    };
  }

  private buildMockLearningPath(
    topic: string,
    profile: UserProfile,
    level: 'beginner' | 'intermediate' | 'advanced'
  ): LearningPath {
    const lang = profile.language || 'en';
    const isHindi = lang === 'hi';

    const modules = [
      {
        title: isHindi ? 'व्यवसाय के मूलभूत सिद्धांत' : 'Business Basics',
        description: isHindi
          ? `शुरुआती व्यवसाय के बुनियादी सिद्धांत सीखें। ${topic} के बारे में मूलभूत जानकारी।`
          : `Learn the fundamentals of starting a business. Introduction to ${topic}.`,
        content: isHindi
          ? `${topic} एक सफल व्यवसाय की दुनिया में आपका स्वागत है। एक व्यवसाय शुरू करने के लिए आपको समझना चाहिए कि ग्राहक क्या चाहिए।`
          : `Welcome to the world of ${topic} business. To start a business you need to understand what customers want.`,
        keyPoints: isHindi
          ? ['ग्राहक की जरूरत समझें', 'स्थानीय बाजार का अध्ययन करें', 'मूलभूत लागत गणना']
          : ['Understand customer needs', 'Study local market', 'Basic cost calculation'],
      },
      {
        title: isHindi ? 'कच्चे माल' : 'Raw Materials',
        description: isHindi
          ? `उपयोगी और सस्ते कच्चे माल की पहचान। ${topic} में कौन से कच्चे माल चाहिए।`
          : `Identify useful and affordable raw materials for ${topic}.`,
        content: isHindi
          ? `कच्चा माल आपके उत्पाद की गुणवत्ता तय करता है। स्थानीय सप्लायर से सहेज़ी लेना बेहतरीन रीती है।`
          : `Raw material determines product quality. Buying from local suppliers in bulk is a smart approach.`,
        keyPoints: isHindi
          ? ['स्थानीय सप्लायर ढूंढें', 'मूल्य-गुणवत्ता समझें', 'सट्टण में बचत']
          : ['Find local suppliers', 'Understand price-quality balance', 'Bulk purchasing savings'],
      },
      {
        title: isHindi ? 'उपकरण और उपक्रम' : 'Equipment',
        description: isHindi
          ? `${topic} के लिए आवश्यक सामान और उपकरण।`
          : `Tools and equipment needed for ${topic}.`,
        content: isHindi
          ? `शुरिशात में कम उपकरण से शुरू करें। जैसे-जैसे व्यवसाय बढ़ेगा, आप उन्नत उपकरण अपग्रेड कर सकते हैं।`
          : `Start with minimal equipment. As business grows, upgrade to advanced tools.`,
        keyPoints: isHindi
          ? ['कम से शुरुआत करें', 'गुणवत्ता पर ध्यान दें', 'रखरखाव का ध्यान रखें'],
          : ['Start small', 'Focus on quality', 'Regular maintenance'],
      },
      {
        title: isHindi ? 'निर्माण / उत्पादन' : 'Manufacturing',
        description: isHindi
          ? `व्यावसायिक रूप से ${topic} बनाने की प्रक्रिया।`
          : `The process of making ${topic} at scale.`,
        content: isHindi
          ? `हर चरण में समान विधि अपनाएं। एक ही समय में धीरे और स्थिर गति बनाए रखें।`
          : `Follow consistent methods at each step. Maintain steady pace and quality throughout.`,
        keyPoints: isHindi
          ? ['प्रक्रिया मानकीकरण', 'गुणवत्ता नियंत्रण', 'कार्यक्षमता'],
          : ['Standardize process', 'Quality control checks', 'Improve efficiency'],
      },
      {
        title: isHindi ? 'पैकेजिंग' : 'Packaging',
        description: isHindi
          ? `अपने ${topic} को आकर्षक और सुरक्षित पैकेज में बंद करें।`
          : `Package your ${topic} attractively and safely.`,
        content: isHindi
          ? `पैकेजिंग आपके ग्राहक के पहला नोटिस पाती है। इसे पेशेवर बनाने के लिए ध्यान दें।`
          : `Packaging is what customers notice first. Invest in professional-looking presentation.`,
        keyPoints: isHindi
          ? ['पेशेवर प्रस्तुति', 'सुरक्षा सुनिश्चित करें', 'लागत प्रबंधित करें'],
          : ['Professional appearance', 'Ensure safety', 'Manage costs'],
      },
      {
        title: isHindi ? 'मूल्य निर्धारण' : 'Pricing',
        description: isHindi
          ? `अपने ${topic} की सही कीमत कैसे तय करें।`
          : `How to price your ${topic} correctly.`,
        content: isHindi
          ? `कीमत = कच्चा माल + श्रम + मुनाफा। अपने स्थानीय प्रतिद्वंद्वियों की तुलना करें।`
          : `Price = Raw material + Labor + Profit. Compare with local competitors.`,
        keyPoints: isHindi
          ? ['मुकाबलता करें', 'मार्जिन निर्धारित करें', 'बंधुभावनाओं के साथ मूल्य', 'लचीला रहें'],
          : ['Competitive pricing', 'Set margins', 'Price with flexibility'],
      },
      {
        title: isHindi ? 'विपणन' : 'Marketing',
        description: isHindi
          ? `अपने ${topic} को ग्राहक तक पहुँचाएं।`
          : `Reach customers for your ${topic}.`,
        content: isHindi
          ? `सोशल मीडिया, शब्द-बदले और स्थानीय बाजार दुकानों से शुरुआत करें।`
          : `Start with social media, word-of-mouth, and local market shops.`,
        keyPoints: isHindi
          ? ['सामाजिक साइट पर उपस्थिति', 'स्थानीय ग्राहकों से जुड़ें', 'डेमो सैंपल दें'],
          : ['Social media presence', 'Connect with local customers', 'Offer demos'],
      },
      {
        title: isHindi ? 'ग्राहक और बी2बी' : 'Customers & B2B',
        description: isHindi
          ? `अपने ${topic} के लिए ग्राहक ढूंढें।`
          : `Find customers for your ${topic}.`,
        content: isHindi
          ? `बीजी मानसून के समय ग्राहक बढ़ते हैं। गर्मियों में तैयार रहें।`
          : `Customer demand increases during festivals. Stock up before peak seasons.`,
        keyPoints: isHindi
          ? ['मौसमी माँग का अनुसरण करें', 'दोहराव वाले ग्राहक बनाएं', 'कस्टमर सेवा'],
          : ['Follow seasonal demand', 'Build repeat customers', 'Customer service'],
      },
      {
        title: isHindi ? 'स्केलिंग' : 'Scaling',
        description: isHindi
          ? `अपने ${topic} व्यवसाय को बढ़ाएं।`
          : `Scale your ${topic} business.`,
        content: isHindi
          ? `कठिनाइयों पर निर्भर करकर धीरे या तेज़ी से बढ़ें। स्थिरता प्राप्त करने पर सोचें।`
          : `Scale slowly or quickly depending on challenges. Think about stability after initial growth.`,
        keyPoints: isHindi
          ? ['स्थिर विकास', 'नयी पीढ़ी को प्रशिक्षित करें', 'नए बाजार'],
          : ['Stable growth', 'Train next generation', 'Explore new markets'],
      },
    ];

    return {
      title: topic,
      description: isHindi
        ? `${topic} सीखें और एक सफल व्यावसायिक शुरुआत करें।`
        : `Learn ${topic} and start a successful business.`,
      category: isHindi ? 'व्यवसाय' : 'business',
      difficulty: level,
      estimatedDuration: '4-6 weeks',
      lessons: modules.map((mod) => ({
        title: mod.title,
        description: mod.description,
        content: mod.content,
        keyPoints: mod.keyPoints,
        quiz: {
          questions: [
            {
              question: isHindi ? `${mod.title} के बारे में क्या सीखा?` : `What did you learn about ${mod.title}?`,
              options: isHindi
                ? ['मूल्य', 'गुणवत्ता', 'दोनों', 'कोई नहीं']
                : ['Price', 'Quality', 'Both', 'None'],
              correctAnswer: 2,
              explanation: isHindi
                ? 'कीमत और गुणवत्ता दोनों महत्वपूर्ण हैं।'
                : 'Both price and quality matter.',
            },
            {
              question: isHindi
                ? `अपने ${topic} के लिए सबसे बेहतरीन ग्राहक कौन है?`
                : `Who is the ideal customer for ${topic}?`,
              options: isHindi
                ? ['बड़े शहर', 'छोटा स्थानीय', 'दोनों', 'कोई नहीं']
                : ['Big city', 'Small local', 'Both', 'None'],
              correctAnswer: 2,
              explanation: isHindi
                ? 'शुरुआत में स्थानीय ग्राहक बेहतरीन रहते हैं।'
                : 'Local customers are best for beginners.',
            },
          ],
          passingScore: 50,
        },
      })),
    };
  }

  private buildMockExplanation(
    topic: string,
    profile: UserProfile,
    options: ExplainContext