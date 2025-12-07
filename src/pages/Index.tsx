import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('hero');
  const [votes, setVotes] = useState<Record<string, number>>({
    'music': 35,
    'video': 28,
    'design': 42,
    'content': 31,
    'innovation': 25,
    'community': 38
  });

  const nominations = [
    {
      id: 'music',
      title: 'Музыкальный прорыв',
      icon: 'Music',
      description: 'Лучший музыкальный проект года',
      color: 'from-red-600 to-red-800'
    },
    {
      id: 'video',
      title: 'Видео года',
      icon: 'Video',
      description: 'Самое впечатляющее видео',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'design',
      title: 'Дизайн & Визуал',
      icon: 'Palette',
      description: 'Лучшая визуальная концепция',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'content',
      title: 'Контент-креатор',
      icon: 'Sparkles',
      description: 'Самый яркий контент-мейкер',
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'innovation',
      title: 'Инновация',
      icon: 'Zap',
      description: 'Самая смелая идея года',
      color: 'from-purple-600 to-red-600'
    },
    {
      id: 'community',
      title: 'Выбор сообщества',
      icon: 'Users',
      description: 'Народное признание',
      color: 'from-pink-600 to-red-600'
    }
  ];

  const participants = [
    {
      id: 1,
      name: 'Анна Светлова',
      category: 'Музыка',
      image: '🎵',
      votes: 156,
      nomination: 'music'
    },
    {
      id: 2,
      name: 'Дмитрий Волков',
      category: 'Видео',
      image: '🎬',
      votes: 142,
      nomination: 'video'
    },
    {
      id: 3,
      name: 'Елена Краснова',
      category: 'Дизайн',
      image: '🎨',
      votes: 189,
      nomination: 'design'
    },
    {
      id: 4,
      name: 'Максим Петров',
      category: 'Контент',
      image: '✨',
      votes: 134,
      nomination: 'content'
    },
    {
      id: 5,
      name: 'София Новикова',
      category: 'Инновации',
      image: '⚡',
      votes: 167,
      nomination: 'innovation'
    },
    {
      id: 6,
      name: 'Артем Смирнов',
      category: 'Сообщество',
      image: '👥',
      votes: 198,
      nomination: 'community'
    }
  ];

  const handleVote = (nominationId: string) => {
    setVotes(prev => ({
      ...prev,
      [nominationId]: (prev[nominationId] || 0) + 1
    }));
    toast({
      title: "Голос учтен! 🔥",
      description: "Спасибо за участие в премии SLIU 2025",
    });
  };

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена! ✨",
      description: "Мы свяжемся с вами в ближайшее время",
    });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-red">
                <Icon name="Award" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight">SLIU 2025</h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('hero')} className="text-sm font-medium hover:text-primary transition-colors">
                Главная
              </button>
              <button onClick={() => scrollToSection('nominations')} className="text-sm font-medium hover:text-primary transition-colors">
                Номинации
              </button>
              <button onClick={() => scrollToSection('participants')} className="text-sm font-medium hover:text-primary transition-colors">
                Участники
              </button>
              <button onClick={() => scrollToSection('voting')} className="text-sm font-medium hover:text-primary transition-colors">
                Голосование
              </button>
              <Button onClick={() => scrollToSection('registration')} className="bg-primary hover:bg-primary/90 glow-red">
                Регистрация
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <Badge className="bg-primary/20 text-primary border-primary/50 text-sm px-4 py-2">
              🔥 Премия года 2025
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight">
              <span className="text-gradient">SLIU</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Главная премия для тех, кто меняет индустрию. Голосуй за лучших и стань частью истории.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => scrollToSection('voting')} size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 glow-red">
                <Icon name="Vote" size={20} className="mr-2" />
                Проголосовать
              </Button>
              <Button onClick={() => scrollToSection('registration')} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6">
                <Icon name="UserPlus" size={20} className="mr-2" />
                Стать участником
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div>
                <div className="text-4xl font-black text-primary">2K+</div>
                <div className="text-sm text-muted-foreground">Участников</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary">6</div>
                <div className="text-sm text-muted-foreground">Номинаций</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Голосов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nominations Section */}
      <section id="nominations" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Номинации</h2>
            <p className="text-muted-foreground text-lg">Шесть категорий для лучших из лучших</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nominations.map((nomination) => (
              <Card key={nomination.id} className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary bg-card/50 backdrop-blur cursor-pointer">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${nomination.color} flex items-center justify-center mb-4 group-hover:glow-red transition-all`}>
                    <Icon name={nomination.icon as any} size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-2xl">{nomination.title}</CardTitle>
                  <CardDescription className="text-base">{nomination.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Голосов:</span>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      {votes[nomination.id]}%
                    </Badge>
                  </div>
                  <Progress value={votes[nomination.id]} className="mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Participants Section */}
      <section id="participants" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Участники</h2>
            <p className="text-muted-foreground text-lg">Топ-6 номинантов по голосам</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map((participant, index) => (
              <Card key={participant.id} className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary bg-card/50 backdrop-blur">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl group-hover:glow-red transition-all">
                      {participant.image}
                    </div>
                    {index < 3 && (
                      <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                        <Icon name="Trophy" size={14} className="mr-1" />
                        TOP {index + 1}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{participant.name}</CardTitle>
                  <CardDescription>{participant.category}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Icon name="Heart" size={18} />
                    <span className="font-bold text-lg">{participant.votes}</span>
                    <span className="text-sm text-muted-foreground">голосов</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Voting Section */}
      <section id="voting" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Голосование</h2>
            <p className="text-muted-foreground text-lg">Выбери своих фаворитов в каждой номинации</p>
          </div>
          <Card className="border-2 border-primary/50 bg-card/50 backdrop-blur glow-red">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="Vote" size={24} className="text-primary" />
                Активное голосование
              </CardTitle>
              <CardDescription>Каждый голос имеет значение</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nominations.map((nomination) => (
                <div key={nomination.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${nomination.color} flex items-center justify-center`}>
                      <Icon name={nomination.icon as any} size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{nomination.title}</div>
                      <div className="text-sm text-muted-foreground">{votes[nomination.id]}% голосов</div>
                    </div>
                  </div>
                  <Button onClick={() => handleVote(nomination.id)} className="bg-primary hover:bg-primary/90">
                    <Icon name="ThumbsUp" size={16} className="mr-2" />
                    Голосовать
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Регистрация</h2>
            <p className="text-muted-foreground text-lg">Стань участником премии SLIU 2025</p>
          </div>
          <Card className="border-2 border-primary/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Форма регистрации</CardTitle>
              <CardDescription>Заполните все поля для участия в премии</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegistration} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя и фамилия</Label>
                  <Input id="name" placeholder="Ваше полное имя" required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Номинация</Label>
                  <select id="category" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Выберите номинацию</option>
                    {nominations.map((nom) => (
                      <option key={nom.id} value={nom.id}>{nom.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Ссылка на портфолио</Label>
                  <Input id="portfolio" type="url" placeholder="https://" required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">О себе</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Расскажите о своих достижениях..." 
                    required 
                    className="bg-background min-h-32"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6 glow-red">
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить заявку
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-red">
                <Icon name="Award" size={24} className="text-white" />
              </div>
              <div>
                <div className="font-black text-xl">SLIU 2025</div>
                <div className="text-sm text-muted-foreground">Премия года</div>
              </div>
            </div>
            <div className="flex gap-6">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Icon name="Instagram" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Icon name="Twitter" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Icon name="Youtube" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Icon name="Mail" size={20} />
              </Button>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            © 2025 SLIU. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
