import BaiduAiAppLogo from '@renderer/assets/images/apps/baidu-ai.png?url'
import BaicuanAppLogo from '@renderer/assets/images/apps/baixiaoying.webp?url'
import BoltAppLogo from '@renderer/assets/images/apps/bolt.svg?url'
import DevvAppLogo from '@renderer/assets/images/apps/devv.png?url'
import DoubaoAppLogo from '@renderer/assets/images/apps/doubao.png?url'
import DuckDuckGoAppLogo from '@renderer/assets/images/apps/duckduckgo.webp?url'
import FeloAppLogo from '@renderer/assets/images/apps/felo.png?url'
import FlowithAppLogo from '@renderer/assets/images/apps/flowith.svg?url'
import GeminiAppLogo from '@renderer/assets/images/apps/gemini.png?url'
import GensparkLogo from '@renderer/assets/images/apps/genspark.jpg?url'
import GithubCopilotLogo from '@renderer/assets/images/apps/github-copilot.webp?url'
import GrokAppLogo from '@renderer/assets/images/apps/grok.png?url'
import HikaLogo from '@renderer/assets/images/apps/hika.webp?url'
import HuggingChatLogo from '@renderer/assets/images/apps/huggingchat.svg?url'
import KimiAppLogo from '@renderer/assets/images/apps/kimi.jpg?url'
import MetasoAppLogo from '@renderer/assets/images/apps/metaso.webp?url'
import NamiAiSearchLogo from '@renderer/assets/images/apps/nm.webp?url'
import PerplexityAppLogo from '@renderer/assets/images/apps/perplexity.webp?url'
import PoeAppLogo from '@renderer/assets/images/apps/poe.webp?url'
import ZhipuProviderLogo from '@renderer/assets/images/apps/qingyan.png?url'
import QwenlmAppLogo from '@renderer/assets/images/apps/qwenlm.webp?url'
import SensetimeAppLogo from '@renderer/assets/images/apps/sensetime.png?url'
import SparkDeskAppLogo from '@renderer/assets/images/apps/sparkdesk.png?url'
import ThinkAnyLogo from '@renderer/assets/images/apps/thinkany.webp?url'
import TiangongAiLogo from '@renderer/assets/images/apps/tiangong.png?url'
import WanZhiAppLogo from '@renderer/assets/images/apps/wanzhi.jpg?url'
import TencentYuanbaoAppLogo from '@renderer/assets/images/apps/yuanbao.png?url'
import YuewenAppLogo from '@renderer/assets/images/apps/yuewen.png?url'
import ZhihuAppLogo from '@renderer/assets/images/apps/zhihu.png?url'
import ClaudeAppLogo from '@renderer/assets/images/models/claude.png?url'
import HailuoModelLogo from '@renderer/assets/images/models/hailuo.png?url'
import QwenModelLogo from '@renderer/assets/images/models/qwen.png?url'
import DeepSeekProviderLogo from '@renderer/assets/images/providers/deepseek.png?url'
import GroqProviderLogo from '@renderer/assets/images/providers/groq.png?url'
import OpenAiProviderLogo from '@renderer/assets/images/providers/openai.png?url'
import SiliconFlowProviderLogo from '@renderer/assets/images/providers/silicon.png?url'
import MinApp from '@renderer/components/MinApp'
import { MinAppType } from '@renderer/types'

export const DEFAULT_MIN_APPS: MinAppType[] = [
  {
    id: 'openai',
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
    logo: {
      type: 'local',
      value: OpenAiProviderLogo
    },
    bodered: true
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    logo: {
      type: 'local',
      value: GeminiAppLogo
    }
  },
  {
    id: 'silicon',
    name: 'SiliconFlow',
    url: 'https://cloud.siliconflow.cn/playground/chat',
    logo: {
      type: 'local',
      value: SiliconFlowProviderLogo
    }
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    logo: {
      type: 'local',
      value: DeepSeekProviderLogo
    }
  },
  {
    id: 'yi',
    name: '万知',
    url: 'https://www.wanzhi.com/',
    logo: {
      type: 'local',
      value: WanZhiAppLogo
    },
    bodered: true
  },
  {
    id: 'zhipu',
    name: '智谱清言',
    url: 'https://chatglm.cn/main/alltoolsdetail',
    logo: {
      type: 'local',
      value: ZhipuProviderLogo
    }
  },
  {
    id: 'moonshot',
    name: 'Kimi',
    url: 'https://kimi.moonshot.cn/',
    logo: {
      type: 'local',
      value: KimiAppLogo
    }
  },
  {
    id: 'baichuan',
    name: '百小应',
    url: 'https://ying.baichuan-ai.com/chat',
    logo: {
      type: 'local',
      value: BaicuanAppLogo
    }
  },
  {
    id: 'dashscope',
    name: '通义千问',
    url: 'https://tongyi.aliyun.com/qianwen/',
    logo: {
      type: 'local',
      value: QwenModelLogo
    }
  },
  {
    id: 'stepfun',
    name: '跃问',
    url: 'https://yuewen.cn/chats/new',
    logo: {
      type: 'local',
      value: YuewenAppLogo
    },
    bodered: true
  },
  {
    id: 'doubao',
    name: '豆包',
    url: 'https://www.doubao.com/chat/',
    logo: {
      type: 'local',
      value: DoubaoAppLogo
    }
  },
  {
    id: 'minimax',
    name: '海螺',
    url: 'https://hailuoai.com/',
    logo: {
      type: 'local',
      value: HailuoModelLogo
    }
  },
  {
    id: 'groq',
    name: 'Groq',
    url: 'https://chat.groq.com/',
    logo: {
      type: 'local',
      value: GroqProviderLogo
    }
  },
  {
    id: 'anthropic',
    name: 'Claude',
    url: 'https://claude.ai/',
    logo: {
      type: 'local',
      value: ClaudeAppLogo
    }
  },
  {
    id: 'baidu-ai-chat',
    name: '文心一言',
    logo: {
      type: 'local',
      value: BaiduAiAppLogo
    },
    url: 'https://yiyan.baidu.com/'
  },
  {
    id: 'tencent-yuanbao',
    name: '腾讯元宝',
    logo: {
      type: 'local',
      value: TencentYuanbaoAppLogo
    },
    url: 'https://yuanbao.tencent.com/chat',
    bodered: true
  },
  {
    id: 'sensetime-chat',
    name: '商量',
    logo: {
      type: 'local',
      value: SensetimeAppLogo
    },
    url: 'https://chat.sensetime.com/wb/chat',
    bodered: true
  },
  {
    id: 'spark-desk',
    name: 'SparkDesk',
    logo: {
      type: 'local',
      value: SparkDeskAppLogo
    },
    url: 'https://xinghuo.xfyun.cn/desk'
  },
  {
    id: 'metaso',
    name: '秘塔AI搜索',
    logo: {
      type: 'local',
      value: MetasoAppLogo
    },
    url: 'https://metaso.cn/'
  },
  {
    id: 'poe',
    name: 'Poe',
    logo: {
      type: 'local',
      value: PoeAppLogo
    },
    url: 'https://poe.com'
  },
  {
    id: 'perplexity',
    name: 'perplexity',
    url: 'https://www.perplexity.ai/',
    logo: {
      type: 'local',
      value: PerplexityAppLogo
    }
  },
  {
    id: 'devv',
    name: 'DEVV_',
    url: 'https://devv.ai/',
    logo: {
      type: 'local',
      value: DevvAppLogo
    }
  },
  {
    id: 'tiangong-ai',
    name: '天工AI',
    url: 'https://www.tiangong.cn/',
    logo: {
      type: 'local',
      value: TiangongAiLogo
    },
    bodered: true
  },
  {
    id: 'zhihu-zhiada',
    name: '知乎直答',
    url: 'https://zhida.zhihu.com/',
    logo: {
      type: 'local',
      value: ZhihuAppLogo
    },
    bodered: true
  },
  {
    id: 'hugging-chat',
    name: 'HuggingChat',
    url: 'https://huggingface.co/chat/',
    logo: {
      type: 'local',
      value: HuggingChatLogo
    },
    bodered: true
  },
  {
    id: 'Felo',
    name: 'Felo',
    url: 'https://felo.ai/',
    logo: {
      type: 'local',
      value: FeloAppLogo
    },
    bodered: true
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duck.ai',
    logo: {
      type: 'local',
      value: DuckDuckGoAppLogo
    }
  },
  {
    id: 'bolt',
    name: 'bolt',
    url: 'https://bolt.new/',
    logo: {
      type: 'local',
      value: BoltAppLogo
    },
    bodered: true
  },
  {
    id: 'nm',
    name: '纳米AI搜索',
    url: 'https://www.n.cn/',
    logo: {
      type: 'local',
      value: NamiAiSearchLogo
    },
    bodered: true
  },
  {
    id: 'thinkany',
    name: 'ThinkAny',
    url: 'https://thinkany.ai/',
    logo: {
      type: 'local',
      value: ThinkAnyLogo
    },
    bodered: true
  },
  {
    id: 'hika',
    name: 'Hika',
    url: 'https://hika.fyi/',
    logo: {
      type: 'local',
      value: HikaLogo
    },
    bodered: true
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    url: 'https://github.com/copilot',
    logo: {
      type: 'local',
      value: GithubCopilotLogo
    }
  },
  {
    id: 'genspark',
    name: 'Genspark',
    url: 'https://www.genspark.ai/',
    logo: {
      type: 'local',
      value: GensparkLogo
    }
  },
  {
    id: 'grok',
    name: 'Grok',
    url: 'https://grok.com',
    logo: {
      type: 'local',
      value: GrokAppLogo
    },
    bodered: true
  },
  {
    id: 'qwenlm',
    name: 'QwenLM',
    url: 'https://qwenlm.ai/',
    logo: {
      type: 'local',
      value: QwenlmAppLogo
    }
  },
  {
    id: 'flowith',
    name: 'Flowith',
    url: 'https://www.flowith.io/',
    logo: {
      type: 'local',
      value: FlowithAppLogo
    },
    bodered: true
  }
]

export function startMinAppById(id: string) {
  const app = DEFAULT_MIN_APPS.find((app) => app?.id === id)
  app && MinApp.start(app)
}
