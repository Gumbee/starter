import { LogbookPage } from '@/types/page';
import { Button } from '@/components/Button';
import { useOAuthProviderSignin } from '@logbook/auth';
import { EmptyLayout } from '@/layouts/EmptyLayout';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';

const Page: LogbookPage = ({}) => {
  const { handleOAuthLogin, loading } = useOAuthProviderSignin();

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col pb-[60px]">
        <Logo className="h-[28px] mb-[32px]" />
        <form className="flex flex-col space-y-[16px] w-[350px]">
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <Button variant="success" pressScale={0.99} type="submit">
            Sign in
          </Button>
          <div className="flex items-center space-x-[16px] py-[10px]">
            <hr className="border-black/10 flex-1" />
            <div className="font-semibold text-xs text-black/10">or</div>
            <hr className="border-black/10 flex-1" />
          </div>
          <Button
            variant="gray"
            loading={loading}
            pressScale={0.99}
            onClick={() => {
              handleOAuthLogin('google');
            }}
            type="button"
          >
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
};

Page.layout = EmptyLayout;

export default Page;
