import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Nomination {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  votes: number;
}

interface User {
  id: number;
  vk_id: number;
  first_name: string;
  last_name: string;
  photo_url: string;
  token: string;
}

const VK_APP_ID = '52755728';
const API_BASE = 'https://functions.poehali.dev';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('sliu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    loadNominations();
  }, []);

  const loadNominations = async () => {
    try {
      const response = await fetch(`${API_BASE}/e3925753-313d-45cc-b75e-84bd283a1ed9`);
      const data = await response.json();
      setNominations(data.nominations || []);
    } catch (error) {
      console.error('Failed to load nominations:', error);
    }
  };

  const handleVKLogin = () => {
    const redirectUri = encodeURIComponent(window.location.origin);
    const vkAuthUrl = `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&display=page&redirect_uri=${redirectUri}&scope=&response_type=code&v=5.131`;
    window.location.href = vkAuthUrl;
  };

  const handleVote = async (nominationId: number) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/e3925753-313d-45cc-b75e-84bd283a1ed9`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(user.id),
        },
        body: JSON.stringify({ nomination_id: nominationId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Голос учтён! 🔥');
        await loadNominations();
      } else if (response.status === 409) {
        alert('Вы уже голосовали за эту номинацию');
      } else {
        throw new Error(data.error || 'Ошибка голосования');
      }
    } catch (error) {
      alert('Не удалось проголосовать. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sliu_user');
    setUser(null);
    alert('Вы вышли из аккаунта');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalVotes = nominations.reduce((sum, nom) => sum + nom.votes, 0);

  return (
    <div className="min-h-screen bg-background">
      {showAuthDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowAuthDialog(false)}>
          <div className="bg-card border-2 border-primary/50 rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-2">Авторизация через ВКонтакте</h2>
            <p className="text-muted-foreground mb-6">Войдите через ВК, чтобы голосовать за номинантов</p>
            <Button 
              onClick={handleVKLogin} 
              className="w-full bg-[#0077FF] hover:bg-[#0066DD] text-white text-lg py-6"
            >
              <Icon name="LogIn" size={20} className="mr-2" />
              Войти через ВКонтакте
            </Button>
          </div>
        </div>
      )}

      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-900 rounded-lg flex items-center justify-center glow-red">
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
              <button onClick={() => scrollToSection('voting')} className="text-sm font-medium hover:text-primary transition-colors">
                Голосование
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm">{user.first_name}</span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Выйти
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthDialog(true)} className="bg-primary hover:bg-primary/90 glow-red">
                  Войти через ВК
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section id="hero" className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight">
              <span className="text-gradient">SLIU</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              Ежегодная премия на которой собираются легенды SIU. Аудитория выберет лучших сиувцев, которые получат нихуя в формате маленького шоу.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => scrollToSection('voting')} size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 glow-red">
                <Icon name="Vote" size={20} className="mr-2" />
                Проголосовать
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto pt-12">
              <div>
                <div className="text-4xl font-black text-primary">{nominations.length}</div>
                <div className="text-sm text-muted-foreground">Номинаций</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary">{totalVotes}</div>
                <div className="text-sm text-muted-foreground">Голосов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="nominations" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Номинации</h2>
            <p className="text-muted-foreground text-lg">Четыре категории для легенд SIU</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {nominations.map((nomination) => {
              const percentage = totalVotes > 0 ? Math.round((nomination.votes / totalVotes) * 100) : 0;
              return (
                <Card key={nomination.id} className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary bg-card/50 backdrop-blur cursor-pointer">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${nomination.color} flex items-center justify-center mb-4 group-hover:glow-red transition-all`}>
                      <Icon name={nomination.icon as any} size={32} className="text-white" />
                    </div>
                    <CardTitle className="text-2xl">{nomination.title}</CardTitle>
                    <CardDescription className="text-base">{nomination.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Голосов: {nomination.votes}</span>
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        {percentage}%
                      </Badge>
                    </div>
                    <Progress value={percentage} className="mt-3" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="voting" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Голосование</h2>
            <p className="text-muted-foreground text-lg">
              {user ? 'Выбери своих фаворитов в каждой номинации' : 'Войдите через ВК, чтобы проголосовать'}
            </p>
          </div>
          <Card className="border-2 border-primary/50 bg-card/50 backdrop-blur glow-red">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="Vote" size={24} className="text-primary" />
                Активное голосование
              </CardTitle>
              <CardDescription>Каждый голос имеет значение. По 1 голосу на номинацию.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nominations.map((nomination) => {
                const percentage = totalVotes > 0 ? Math.round((nomination.votes / totalVotes) * 100) : 0;
                return (
                  <div key={nomination.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${nomination.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon name={nomination.icon as any} size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{nomination.title}</div>
                        <div className="text-sm text-muted-foreground">{nomination.votes} голосов ({percentage}%)</div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleVote(nomination.id)} 
                      disabled={loading || !user}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Icon name="ThumbsUp" size={16} className="mr-2" />
                      Голосовать
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-900 rounded-lg flex items-center justify-center glow-red">
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