import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, axios, user } = useAppContext()

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan', {
        headers: { Authorization: token }
      });
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || 'Failed to load plans.');
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  const purchasePlan = (planId) => {
    return axios.post('/api/credit/purchase', { planId }, { headers: { Authorization: token } })
      .then(({ data }) => {
        if (data.success) {
          window.location.href = data.url;
        } else {
          return Promise.reject(new Error(data.message || 'Purchase failed'));
        }
      });
  }

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Loading />;

  return (
    <div className="flex-1 h-screen overflow-y-auto scrollbar-none px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-5xl mx-auto text-center mb-12 animate-fade-up">
        <p className="text-xs font-semibold tracking-wider uppercase text-primary">Pricing</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-ink-dark">
          Credits that fit how you work
        </h1>
        <p className="mt-2 text-sm text-ink-dim dark:text-ink-dim-dark">
          You currently have <span className="font-medium text-primary">{user?.credits ?? 0}</span> credits. Top up any time.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const featured = plan._id === "pro";
          return (
            <div
              key={plan._id}
              className={`relative flex flex-col p-6 rounded-2xl border transition-shadow animate-fade-up ${
                featured
                  ? "border-primary shadow-xl shadow-primary/10 bg-surface dark:bg-surface-dark"
                  : "border-[#E4E0F5] dark:border-[#2A2440] bg-surface dark:bg-surface-dark hover:shadow-lg"
              }`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow">
                  Most popular
                </span>
              )}

              <h3 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                {plan.name}
              </h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-ink dark:text-ink-dark">${plan.price}</span>
                <span className="text-sm text-ink-dim dark:text-ink-dim-dark">/ {plan.credits} credits</span>
              </p>

              <ul className="mt-5 space-y-2.5 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-ink-dim dark:text-ink-dim-dark">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  toast.promise(
                    purchasePlan(plan._id),
                    {
                      loading: 'Setting up checkout…',
                      success: 'Redirecting to checkout…',
                      error: (err) => err?.message || 'Purchase failed',
                    }
                  )
                }
                className={`mt-6 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                  featured
                    ? "bg-brand-gradient text-white hover:opacity-90 shadow-md shadow-primary/20"
                    : "bg-surface-alt dark:bg-surface-alt-dark text-ink dark:text-ink-dark hover:bg-primary/10 hover:text-primary"
                }`}
              >
                Buy {plan.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Credits
